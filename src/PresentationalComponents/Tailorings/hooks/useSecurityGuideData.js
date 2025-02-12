import useSecurityGuideRuleTree from 'Utilities/hooks/api/useSecurityGuideRuleTree';
import useSecurityGuide from 'Utilities/hooks/api/useSecurityGuide';
import useBatchedRuleGroups from './useBatchedRuleGroups';
import useBatchedValueDefinitions from './useBatchedValueDefinitions';
import useBatchedRules from './useBatchedRules';

const useSecurityGuideData = ({
  securityGuideId,
  skipRuleTree,
  skipRuleGroups,
  skipValueDefinitions,
  skipRules,
  groupFilter,
  tableState: { tableState: { tableView } = {} } = {},
}) => {
  const {
    data: securityGuide,
    loading: securityGuideLoading,
    error: securityGuideError,
  } = useSecurityGuide({
    params: { securityGuideId },
    skip: !securityGuideId,
  });

  const {
    data: rules,
    loading: rulesLoading,
    error: rulesError,
    fetchBatched: fetchBatchedRules,
  } = useBatchedRules({
    params: {
      securityGuideId,
      filter: groupFilter,
    },
    skip: skipRules,
    batched: tableView === 'tree',
    useTableState: true,
  });

  const {
    loading: ruleGroupsLoading,
    data: ruleGroups,
    error: ruleGroupsError,
  } = useBatchedRuleGroups({
    params: {
      securityGuideId,
    },
    skip: skipRuleGroups,
    batched: true,
  });

  const {
    data: ruleTree,
    loading: ruleTreeLoading,
    error: ruleTreeError,
  } = useSecurityGuideRuleTree({
    params: {
      securityGuideId,
    },
    skip: skipRuleTree,
  });

  const {
    loading: valueDefinitionsLoading,
    data: valueDefinitions,
    error: valueDefinitionsError,
  } = useBatchedValueDefinitions({
    params: {
      securityGuideId,
    },
    skip: skipValueDefinitions,
    batched: true,
  });

  return {
    loading:
      rulesLoading ||
      ruleTreeLoading ||
      ruleGroupsLoading ||
      valueDefinitionsLoading ||
      securityGuideLoading,
    error:
      rulesError ||
      ruleTreeError ||
      ruleGroupsError ||
      valueDefinitionsError ||
      securityGuideError,
    data: {
      ...(securityGuideId ? { securityGuide } : {}),
      ...(!skipRuleGroups ? { ruleGroups } : {}),
      ...(!skipValueDefinitions ? { valueDefinitions } : {}),
      ...(!skipRuleTree ? { ruleTree } : {}),
      ...(!skipRules ? { rules } : {}),
    },
    fetchBatchedRules,
  };
};

export default useSecurityGuideData;
