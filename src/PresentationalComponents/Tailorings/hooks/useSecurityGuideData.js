import useSecurityGuideRuleTree from 'Utilities/hooks/api/useSecurityGuideRuleTree';
import useSecurityGuide from 'Utilities/hooks/api/useSecurityGuide';
import useProfileTree from 'Utilities/hooks/api/useProfileTree';
import useBatchedRuleGroups from './useBatchedRuleGroups';
import useBatchedValueDefinitions from './useBatchedValueDefinitions';
import useBatchedRules from './useBatchedRules';
import useBatchedProfileRules from './useBatchedProfileRules';

const useSecurityGuideData = ({
  securityGuideId,
  profileId,
  skipRuleTree,
  skipRuleGroups,
  skipValueDefinitions,
  skipRules,
  skipProfileRules,
  skipProfileTree,
  groupFilter,
  tableState: {
    tableState: { tableView } = {},
    serialisedTableState: { filters, pagination, sort } = {},
  } = {},
}) => {
  const {
    data: securityGuide,
    loading: securityGuideLoading,
    error: securityGuideError,
  } = useSecurityGuide({
    params: { securityGuideId },
    skip: !securityGuideId,
  });

  const ruleParams = {
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
  };

  const {
    data: rules,
    loading: rulesLoading,
    error: rulesError,
    fetchBatched: fetchBatchedRules,
  } = useBatchedRules({
    params: ruleParams,
    skip: skipRules,
    batched: tableView === 'tree',
  });

  const {
    data: profileRules,
    loading: profileRulesLoading,
    error: profileRulesError,
    fetchBatched: fetchBatchedProfileRules,
  } = useBatchedProfileRules({
    params: ruleParams,
    skip: skipProfileRules,
    batched: tableView === 'tree',
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
    data: profileTree,
    loading: profileTreeLoading,
    error: profileTreeError,
  } = useProfileTree({
    params: {
      securityGuideId,
      profileId,
    },
    skip: skipProfileTree,
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
      profileRulesLoading ||
      profileTreeLoading ||
      securityGuideLoading,
    error:
      rulesError ||
      ruleTreeError ||
      ruleGroupsError ||
      valueDefinitionsError ||
      profileTreeError ||
      profileRulesError ||
      securityGuideError,
    data: {
      ...(securityGuideId ? { securityGuide } : {}),
      ...(!skipRuleGroups ? { ruleGroups } : {}),
      ...(!skipValueDefinitions ? { valueDefinitions } : {}),
      ...(!skipRuleTree ? { ruleTree: ruleTree } : {}),
      ...(!skipProfileTree ? { ruleTree: profileTree } : {}),
      ...(!skipRules
        ? {
            rules: rules,
          }
        : {}),
      ...(!skipProfileRules
        ? {
            rules: profileRules,
          }
        : {}),
    },
    fetchBatchedRules: profileId ? fetchBatchedProfileRules : fetchBatchedRules,
  };
};

export default useSecurityGuideData;
