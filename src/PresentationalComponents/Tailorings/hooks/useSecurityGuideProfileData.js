import useProfileTree from 'Utilities/hooks/api/useProfileTree';
import useProfileRules from 'Utilities/hooks/api/useProfileRules';

const useSecurityGuideProfileData = ({
  securityGuideId,
  profileId,
  skipRuleTree,
  skipRules,
  groupFilter,
  tableState: { tableState: { tableView } = {} } = {},
}) => {
  const {
    data: { data: ruleTree } = {},
    loading: profileTreeLoading,
    error: profileTreeError,
  } = useProfileTree({
    params: {
      securityGuideId,
      profileId,
    },
    skip: skipRuleTree,
  });

  const {
    data: rules,
    loading: profileRulesLoading,
    error: profileRulesError,
    exporter,
  } = useProfileRules({
    params: {
      securityGuideId,
      profileId,
      ...(groupFilter && { filters: groupFilter }),
    },
    skip: skipRules,
    batched: tableView === 'tree',
    useTableState: true,
  });

  return {
    loading: profileRulesLoading || profileTreeLoading,
    error: profileTreeError || profileRulesError,
    data: {
      ...(!skipRules ? { rules } : {}),
      ...(!skipRuleTree ? { ruleTree } : {}),
    },
    exporter,
  };
};

export default useSecurityGuideProfileData;
