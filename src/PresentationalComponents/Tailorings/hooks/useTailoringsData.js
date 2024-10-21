import { useCallback, useMemo } from 'react';
import useTailoringRules from 'Utilities/hooks/api/useTailoringRules';
import useSecurityGuideData from './useSecurityGuideData';

const shouldSkip = (request, { view }) =>
  ({
    ruleTree: view !== 'tree',
    ruleGroups: view !== 'tree',
    rules: false,
    valueDefinitions: false,
  }[request]);

const useTailoringsData = (
  { id: policyId } = {},
  { id: tailoringId, security_guide_id } = {},
  {
    tableState = {},
    serialisedTableState: { filters, pagination, sort } = {},
  } = {}
) => {
  const {
    ruleTree,
    ruleGroups,
    valueDefinitions,
    loading: securityGuideDataLoading,
    error: securityGuideDataError,
  } = useSecurityGuideData(security_guide_id, {
    skipRuleTree: shouldSkip('ruleTree', tableState),
    skipRuleGroups: shouldSkip('ruleGroups', tableState),
    skipValueDefinitions: shouldSkip('valueDefinitions', tableState),
  });
  const openRuleGroups = tableState?.['open-items']?.filter((itemId) =>
    ruleGroups?.map(({ id }) => id).includes(itemId)
  );
  const groupFilter =
    openRuleGroups?.length > 0
      ? `rule_group_id ^ (${openRuleGroups.map((id) => `"${id}"`).join(',')})`
      : undefined;

  const ruleParams = useMemo(
    () => [
      undefined,
      // TODO this is a hack: The state value defaults should come from the state itself
      pagination?.limit || 10,
      pagination?.offset || 0,
      sort || 'title:asc',
      ...(filters || groupFilter
        ? [
            filters
              ? `(${filters})${groupFilter ? ` AND (${groupFilter})` : ''}`
              : groupFilter,
          ]
        : []),
      undefined,
    ],
    [filters, pagination, groupFilter, sort]
  );

  const {
    data: rules,
    loading: rulesLoading,
    error: rulesError,
    fetch: fetchTailoringRules,
  } = useTailoringRules(policyId, tailoringId, {
    params: ruleParams,
    skip: shouldSkip('rules', tableState),
  });

  const fetchRules = useCallback(
    async (offset, limit) => {
      const fetchParams = [
        policyId,
        tailoringId,
        ...ruleParams.map((value, idx) => {
          if (idx === 1) {
            return limit;
          }
          if (idx === 2) {
            return offset;
          }
          return value;
        }),
      ];

      return await fetchTailoringRules(fetchParams, false);
    },
    [fetchTailoringRules, policyId, tailoringId, ruleParams]
  );

  const loading = securityGuideDataLoading || rulesLoading;
  const error = !!securityGuideDataError || !!rulesError;

  return {
    error,
    loading,
    data: !loading ? { ruleTree, rules, ruleGroups, valueDefinitions } : {},
    fetchRules,
  };
};

export default useTailoringsData;
