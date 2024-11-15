import { useCallback, useMemo } from 'react';
import useSecurityGuideRuleTree from 'Utilities/hooks/api/useSecurityGuideRuleTree';
import useBatchedRuleGroups from './useBatchedRuleGroups';
import useBatchedValueDefinitions from './useBatchedValueDefinitions';
import useRules from 'Utilities/hooks/api/useRules';

const useSecurityGuideData = (
  securityGuideId,
  {
    skipRuleTree,
    skipRuleGroups,
    skipValueDefinitions,
    skipRules,
    groupFilter,
    tableState: {
      serialisedTableState: { filters, pagination, sort } = {},
    } = {},
  }
) => {
  const ruleParams = useMemo(
    () => [
      securityGuideId,
      undefined,
      // TODO this is a hack: The state value defaults should come from the state itself
      pagination?.limit || 10,
      pagination?.offset || 0,
      undefined,
      sort || 'title:asc',
      ...(filters || groupFilter
        ? [
            filters
              ? `(${filters})${groupFilter ? ` AND (${groupFilter})` : ''}`
              : groupFilter,
          ]
        : []),
    ],
    [filters, pagination, groupFilter, sort, securityGuideId]
  );

  const {
    data: rules,
    loading: rulesLoading,
    error: rulesError,
    fetch: fetchSecurityGuideRules,
  } = useRules({
    params: ruleParams,
    skip: skipRules,
  });

  const fetchRules = useCallback(
    async (offset, limit) => {
      const fetchParams = [
        securityGuideId,
        ...ruleParams.map((value, idx) => {
          if (idx === 2) {
            return limit;
          }
          if (idx === 3) {
            return offset;
          }
          return value;
        }),
      ];

      return await fetchSecurityGuideRules(fetchParams, false);
    },
    [fetchSecurityGuideRules, securityGuideId, ruleParams]
  );

  const {
    loading: ruleGroupsLoading,
    data: ruleGroups,
    error: ruleGroupsError,
  } = useBatchedRuleGroups(securityGuideId, { skip: skipRuleGroups });

  const {
    data: ruleTree,
    loading: ruleTreeLoading,
    error: ruleTreeError,
  } = useSecurityGuideRuleTree(securityGuideId, {
    skip: skipRuleTree,
  });

  const {
    loading: valueDefinitionsLoading,
    data: valueDefinitions,
    error: valueDefinitionsError,
  } = useBatchedValueDefinitions(securityGuideId, {
    skip: skipValueDefinitions,
  });

  return {
    loading:
      rulesLoading ||
      ruleTreeLoading ||
      ruleGroupsLoading ||
      valueDefinitionsLoading,
    error:
      rulesError || ruleTreeError || ruleGroupsError || valueDefinitionsError,
    data: {
      ...(!skipRuleGroups ? { ruleGroups } : {}),
      ...(!skipValueDefinitions ? { valueDefinitions } : {}),
      ...(!skipRuleTree ? { ruleTree } : {}),
      ...(!skipRules ? { fetchRules, rules } : {}),
    },
  };
};

export default useSecurityGuideData;
