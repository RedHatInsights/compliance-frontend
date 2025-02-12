import useProfileTree from 'Utilities/hooks/api/useProfileTree';
import useBatchedProfileRules from './useBatchedProfileRules';

const useSecurityGuideProfileData = ({
  securityGuideId,
  profileId,
  skipRuleTree,
  skipRules,
  groupFilter,
  tableState: { tableState: { tableView } = {} } = {},
}) => {
  const {
    data: ruleTree,
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
    fetchBatched: fetchBatchedProfileRules,
  } = useBatchedProfileRules({
    params: {
      securityGuideId,
      profileId,
      filter: groupFilter,
    },
    skip: skipRules,
    batched: tableView === 'tree',
    useTableState: true,
  });
  console.log('Skippy', skipRules);
  return {
    loading: profileRulesLoading || profileTreeLoading,
    error: profileTreeError || profileRulesError,
    data: {
      ...(!skipRules ? { rules } : {}),
      ...(!skipRuleTree ? { ruleTree } : {}),
    },
    fetchBatchedProfileRules,
  };
};

export default useSecurityGuideProfileData;
