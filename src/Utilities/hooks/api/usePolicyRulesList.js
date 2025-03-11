import { buildTreeTable } from 'PresentationalComponents/Tailorings/helpers/prepareTreeTable';
import useProfileTree from './useProfileTree';
import useRuleGroups from './useRuleGroups';

import useProfileRules from './useProfileRules';

export const usePolicyRulesList = ({
  profileId,
  securityGuideId,
  groupFilter,
  shouldSkip,
}) => {
  const {
    loading: isProfileRulesListLoading,
    data: profileRules,
    error: profileRulesListError,
    exporter,
  } = useProfileRules({
    params: {
      securityGuideId,
      profileId,
      groupFilter,
    },
    skip: shouldSkip.rule,
    useTableState: true,
  });

  const {
    data: rulesTreeData,
    loading: rulesTreeLoading,
    error: rulesTreeError,
  } = useProfileTree({
    params: {
      securityGuideId,
      profileId,
    },
    skip: shouldSkip.ruleTree,
  });

  const {
    loading: ruleGroupsLoading,
    data: ruleGroups,
    error: ruleGroupsError,
  } = useRuleGroups({
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
  const error =
    profileRulesListError || rulesTreeError || ruleGroupsError || undefined;

  return {
    data: { rules: profileRules, ruleGroups, builtTree },
    error,
    loading,
    exporter,
  };
};
