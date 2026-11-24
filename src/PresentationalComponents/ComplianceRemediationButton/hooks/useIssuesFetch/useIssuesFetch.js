import { useCallback, useState } from 'react';
import useReportRuleResults from 'Utilities/hooks/api/useReportRuleResults';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import useValueDefinitions from 'Utilities/hooks/api/useValueDefinitions';
import useRules from 'Utilities/hooks/api/useRules';
import { uniq } from 'Utilities/helpers';
import {
  compileRemediatonData,
  buildFetchQueue,
  isReportTestResultSupported,
  buildSystemOsMinorMap,
  buildOverridesByOsMinor,
} from './helpers';

// Security guides that have Tailoring value_overrides — used to fetch value
// definitions (UUID → var_*) and rules (value_checks for per-rule filtering).
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

const getOverrideValueDefinitionIds = (tailorings = []) =>
  uniq(
    tailorings.flatMap(({ value_overrides: valueOverrides = {} }) =>
      Object.keys(valueOverrides),
    ),
  );

const buildValueChecksByRuleId = (rules = []) =>
  rules.reduce(
    (acc, { id, value_checks: valueChecks = [] }) => ({
      ...acc,
      [id]: valueChecks,
    }),
    {},
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
  const { queryTotalBatched: fetchRules } = useRules({
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
      const overrideValueDefinitionIds =
        getOverrideValueDefinitionIds(tailorings);
      const remediableRuleIds = uniq(
        ruleRestults.map(({ rule_id }) => rule_id).filter(Boolean),
      );

      const valueDefinitionsBySecurityGuideId = {};
      const valueChecksByRuleId = {};

      for (const securityGuideId of securityGuideIds) {
        // Only fetch value definitions referenced by Tailoring overrides.
        const valueDefinitionFilters =
          overrideValueDefinitionIds.length > 0
            ? {
                filters: `id ^ (${overrideValueDefinitionIds.join(' ')})`,
              }
            : {};

        const { data: valueDefinitions = [] } = await fetchValueDefinitions({
          securityGuideId,
          ...valueDefinitionFilters,
        });
        valueDefinitionsBySecurityGuideId[securityGuideId] = valueDefinitions;

        // Rules provide value_checks so we can scope overrides per issue/rule.
        if (remediableRuleIds.length > 0) {
          const { data: rules = [] } = await fetchRules({
            securityGuideId,
            filters: `id ^ (${remediableRuleIds.join(' ')})`,
          });
          Object.assign(valueChecksByRuleId, buildValueChecksByRuleId(rules));
        }
      }

      const systemOsMinorMap = buildSystemOsMinorMap(reportTestResults);
      const overridesByOsMinor = buildOverridesByOsMinor(tailorings);

      return compileRemediatonData(ruleRestults, selectedRuleResultIds, {
        systemOsMinorMap,
        overridesByOsMinor,
        valueDefinitionsBySecurityGuideId,
        valueChecksByRuleId,
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    fetchBatchedQueue,
    fetchRules,
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
