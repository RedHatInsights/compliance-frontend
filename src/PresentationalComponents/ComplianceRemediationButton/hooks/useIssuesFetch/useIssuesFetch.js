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

// Returns security_guide_ids for Tailorings that have value_overrides.
// Those ids tell us which value definitions to fetch so
// mapValueOverridesToRefIds can map UUIDs to ref_ids.
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
  // skip: true → do not fetch on mount; call only from fetchIssues (Plan remediation)
  const { query: fetchTailorings } = useTailorings({ skip: true });
  const { queryTotalBatched: fetchValueDefinitions } = useValueDefinitions({
    batched: true,
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

      // One list for the policy (reportId === policyId). Each Tailoring is per
      // OS minor and may include UUID-keyed value_overrides.
      const { data: tailorings = [] } = await fetchTailorings({
        policyId: reportId,
        filters: 'NOT(null? os_minor_version)',
      });

      // Skip value-definition calls when nothing is tailored
      const securityGuideIds = getSecurityGuideIdsWithOverrides(tailorings);
      const valueDefinitionsBySecurityGuideId = {};

      for (const securityGuideId of securityGuideIds) {
        const { data: valueDefinitions = [] } = await fetchValueDefinitions({
          securityGuideId,
        });
        valueDefinitionsBySecurityGuideId[securityGuideId] = valueDefinitions;
      }

      // system → OS minor → Tailoring overrides (UUID → var_*/ref_id)
      const systemOsMinorMap = buildSystemOsMinorMap(reportTestResults);
      const overridesByOsMinor = buildOverridesByOsMinor(
        tailorings,
        valueDefinitionsBySecurityGuideId,
      );

      return compileRemediatonData(ruleRestults, selectedRuleResultIds, {
        systemOsMinorMap,
        overridesByOsMinor,
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
