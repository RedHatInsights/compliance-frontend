import useComplianceQuery from 'Utilities/hooks/api/useComplianceQuery';
import { useCallback, useMemo } from 'react';
import { useProfileTree } from './useProfileTree';
import { buildTreeTable } from 'PresentationalComponents/Tailorings/helpers';
import useBatchedRuleGroups from 'PresentationalComponents/hooks/useBatchedRuleGroups';

export const usePolicyRulesList = ({
  profileId,
  securityGuideId,
  tableState: { serialisedTableState: { filters, pagination, sort } = {} } = {},
  groupFilter,
  shouldSkip,
}) => {
  const ruleParams = useMemo(
    () => [
      securityGuideId,
      profileId,
      undefined,
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
      undefined,
    ],
    [securityGuideId, profileId, pagination, sort, filters, groupFilter]
  );

  const {
    loading: isProfileRulesListLoading,
    data: profileRules,
    error: profileRulesListError,
    fetch: fetchProfileRulesList,
  } = useComplianceQuery('profileRules', {
    params: ruleParams,
    skip: shouldSkip.rule,
  });

  const fetchRules = useCallback(
    async (offset, limit) => {
      const fetchParams = [
        profileId,
        securityGuideId,
        ...ruleParams.map((value, idx) => {
          if (idx === 3) {
            return limit;
          }
          if (idx === 4) {
            return offset;
          }
          return value;
        }),
      ];

      return await fetchProfileRulesList(fetchParams, false);
    },
    [fetchProfileRulesList, profileId, securityGuideId, ruleParams]
  );

  const {
    data: rulesTreeData,
    loading: rulesTreeLoading,
    error: rulesTreeError,
  } = useProfileTree({
    securityGuideId: securityGuideId,
    profileId: profileId,
    skip: shouldSkip.ruleTree,
  });

  const {
    loading: ruleGroupsLoading,
    data: ruleGroups,
    error: ruleGroupsError,
  } = useBatchedRuleGroups(securityGuideId, { skip: shouldSkip.ruleGroups });

  const builtTree = ruleGroups
    ? buildTreeTable(rulesTreeData, ruleGroups)
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
