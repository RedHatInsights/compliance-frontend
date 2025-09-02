import useSecurityGuideRuleTree from 'Utilities/hooks/api/useSecurityGuideRuleTree';
import useSecurityGuide from 'Utilities/hooks/api/useSecurityGuide';
import useRuleGroups from 'Utilities/hooks/api/useRuleGroups';
import useValueDefinitions from 'Utilities/hooks/api/useValueDefinitions';
import useRules from 'Utilities/hooks/api/useRules';

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
  });

  const {
    data: { data: ruleTree } = {},
    loading: ruleTreeLoading,
    error: ruleTreeError,
  } = useSecurityGuideRuleTree({
    params: {
      securityGuideId,
    },
    skip: skipRuleTree,
  });

  const {
    data: { data: ruleGroups } = {},
    loading: ruleGroupsLoading,
    error: ruleGroupsError,
  } = useRuleGroups({
    params: {
      securityGuideId,
    },
    skip: skipRuleGroups,
    batched: true,
  });

  const {
    data: rules,
    loading: rulesLoading,
    error: rulesError,
    fetchAllIds,
    exporter,
  } = useRules({
    params: {
      securityGuideId,
      filter: groupFilter,
    },
    skip: skipRules,
    batched: tableView === 'tree',
    useTableState: true,
  });

  const {
    loading: valueDefinitionsLoading,
    data: valueDefinitions,
    error: valueDefinitionsError,
  } = useValueDefinitions({
    params: {
      securityGuideId,
    },
    skip: skipValueDefinitions,
    batched: true,
  });

  return {
    rulesLoading,
    ruleTreeLoading,
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
    fetchAllIds,
    exporter,
  };
};

export default useSecurityGuideData;
