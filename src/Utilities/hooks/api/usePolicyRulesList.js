import { useCallback, useMemo } from 'react';
import useProfileTree from './useProfileTree';
import { buildTreeTable } from 'PresentationalComponents/Tailorings/helpers';
import useBatchedRuleGroups from 'PresentationalComponents/Tailorings/hooks/useBatchedRuleGroups';
import useProfileRules from './useProfileRules';

export const usePolicyRulesList = ({
  profileId,
  securityGuideId,
  tableState: { serialisedTableState: { filters, pagination, sort } = {} } = {},
  groupFilter,
  shouldSkip,
}) => {
  const ruleParams = useMemo(
    () => ({
      securityGuideId,
      profileId,
      limit: pagination?.limit || 10,
      offset: pagination?.offset || 0,
      sortBy: sort || 'title:asc',
      filter:
        filters || groupFilter
          ? [
              filters
                ? `(${filters})${groupFilter ? ` AND (${groupFilter})` : ''}`
                : groupFilter,
            ]
          : undefined,
    }),
    [securityGuideId, profileId, pagination, sort, filters, groupFilter]
  );
  const {
    loading: isProfileRulesListLoading,
    data: profileRules,
    error: profileRulesListError,
    fetch: fetchProfileRulesList,
  } = useProfileRules({
    params: ruleParams,
    skip: shouldSkip.rule,
  });

  const fetchRules = useCallback(
    async (offset, limit) => {
      const fetchParams = [
        securityGuideId,
        profileId,
        undefined,
        limit,
        offset,
      ];
      return await fetchProfileRulesList(fetchParams, false);
    },
    [fetchProfileRulesList, profileId, securityGuideId]
  );

  const {
    data: rulesTreeData,
    loading: rulesTreeLoading,
    error: rulesTreeError,
  } = useProfileTree({
    params: {
      securityGuideId: securityGuideId,
      profileId: profileId,
    },
    skip: shouldSkip.ruleTree,
  });

  const {
    loading: ruleGroupsLoading,
    data: ruleGroups,
    error: ruleGroupsError,
  } = useBatchedRuleGroups({
    params: {
      securityGuideId,
    },
    skip: shouldSkip.ruleGroups,
    batched: true,
  });

  const builtTree = ruleGroups
    ? buildTreeTable(rulesTreeData, ruleGroups?.data)
    : undefined;

  const loading =
    isProfileRulesListLoading || ruleGroupsLoading || rulesTreeLoading;
  let error =
    profileRulesListError || rulesTreeError || ruleGroupsError || undefined;

  return {
    data: { rules: profileRules, ruleGroups, builtTree },
    error,
    loading,
    fetchRules,
  };
};
