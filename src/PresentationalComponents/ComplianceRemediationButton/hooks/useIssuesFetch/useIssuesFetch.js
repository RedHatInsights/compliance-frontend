import { useCallback, useState } from 'react';
import useReportRuleResults from 'Utilities/hooks/api/useReportRuleResults';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import useValueDefinitions from 'Utilities/hooks/api/useValueDefinitions';
import { uniq } from 'Utilities/helpers';
import {
  compileRemediatonData,
  buildFetchQueue,
  isReportTestResultSupported,
  buildSystemOsMinorMap,
  buildOverridesByOsMinor,
} from './helpers';

// Security guides that have Tailoring value_overrides — used to fetch value
// definitions (UUID → var_*).
const getSecurityGuideIdsWithOverrides = (tailorings = []) =>
  uniq(
    tailorings
      .filter(
        ({ value_overrides: valueOverrides }) =>
          valueOverrides && Object.keys(valueOverrides).length > 0,
      )
      .map(({ security_guide_id }) => security_guide_id)
      .filter(Boolean),
  );

export const useIssuesFetch = ({
  reportId,
  reportTestResults,
  selectedRuleResultIds,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchBatchedQueue } = useReportRuleResults({
    params: {
      reportId,
      filters: 'result=fail AND remediation_available=true',
      sort: 'precedence:asc',
    },
    skip: true,
  });
  // skip: true → fetch only from fetchIssues (Plan remediation), not on mount
  const { query: fetchTailorings } = useTailorings({ skip: true });
  const { queryTotalBatched: fetchValueDefinitions } = useValueDefinitions({
    batched: true,
    batch: { batchSize: 100 },
    skip: true,
  });

  // dataProvider for Remediations: issues + systems, with optional value_overrides
  const fetchIssues = useCallback(async () => {
    setIsLoading(true);

    try {
      const testResultsQueue = buildFetchQueue(reportTestResults);
      const ruleRestults = (await fetchBatchedQueue(testResultsQueue)).reduce(
        (allRules, { data }) => [...(allRules || []), ...data],
        [],
      );

      // reportId === policyId in this app. Each Tailoring is per OS minor.
      const { data: tailorings = [] } = await fetchTailorings({
        policyId: reportId,
        filters: 'NOT(null? os_minor_version)',
      });

      const securityGuideIds = getSecurityGuideIdsWithOverrides(tailorings);
      const valueDefinitionsBySecurityGuideId = {};

      for (const securityGuideId of securityGuideIds) {
        // Value definitions for this SSG — used to map override UUIDs → var_* keys.
        // Filterable fields are only title/ref_id (not id); fetch the full SSG set.
        const { data: valueDefinitions = [] } = await fetchValueDefinitions({
          securityGuideId,
        });
        valueDefinitionsBySecurityGuideId[securityGuideId] = valueDefinitions;
      }

      const systemOsMinorMap = buildSystemOsMinorMap(reportTestResults);
      const overridesByOsMinor = buildOverridesByOsMinor(tailorings);

      // rule_results include value_checks (value definition UUIDs) for per-rule
      // scoping — no separate Rules list fetch needed.
      return compileRemediatonData(ruleRestults, selectedRuleResultIds, {
        systemOsMinorMap,
        overridesByOsMinor,
        valueDefinitionsBySecurityGuideId,
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    fetchBatchedQueue,
    fetchTailorings,
    fetchValueDefinitions,
    reportId,
    reportTestResults,
    selectedRuleResultIds,
  ]);

  const canFetch = reportTestResults?.filter(
    (reportTestResult) =>
      isReportTestResultSupported(reportTestResult) &&
      reportTestResult?.failed_rule_count > 0,
  ).length;

  return {
    canFetch,
    isLoading,
    fetchIssues,
  };
};

export default useIssuesFetch;
