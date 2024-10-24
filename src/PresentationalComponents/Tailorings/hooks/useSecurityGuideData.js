import { useCallback } from 'react';
import useSecurityGuideRuleTree from 'Utilities/hooks/api/useSecurityGuideRuleTree';
import useRuleGroups from 'Utilities/hooks/api/useRuleGroups';
import useValueDefinitions from 'Utilities/hooks/api/useValueDefinitions';

import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';
import { buildTreeTable } from '../helpers';

const useSecurityGuideData = (
  securityGuideId,
  { skipRuleTree, skipRuleGroups, skipValueDefinitions }
) => {
  const {
    data: ruleTree,
    loading: ruleTreeLoading,
    error: ruleTreeError,
  } = useSecurityGuideRuleTree(securityGuideId, {
    skip: skipRuleTree,
  });

  const { fetch: fetchRuleGroups } = useRuleGroups({
    params: {
      securityGuideId,
    },
    skip: true,
  });
  const fetchRuleGroupsForBatch = useCallback(
    (offset, limit) =>
      fetchRuleGroups({ securityGuideId, limit, offset }, false),
    [fetchRuleGroups, securityGuideId]
  );
  const {
    loading: ruleGroupsLoading,
    data: ruleGroups,
    error: ruleGroupsError,
  } = useFetchTotalBatched(fetchRuleGroupsForBatch, {
    batchSize: 60,
    skip: skipRuleGroups,
  });

  const { fetch: fetchValueDefinitions } = useValueDefinitions({
    skip: true,
  });
  const fetchValueDefinitionsForBatch = useCallback(
    (offset, limit) =>
      fetchValueDefinitions([securityGuideId, undefined, limit, offset], false),
    [fetchValueDefinitions, securityGuideId]
  );
  const {
    loading: valueDefinitionsLoading,
    data: valueDefinitions,
    error: valueDefinitionsError,
  } = useFetchTotalBatched(fetchValueDefinitionsForBatch, {
    batchSize: 60,
    skip: skipValueDefinitions,
  });

  const namedRuleTree = ruleGroups
    ? buildTreeTable(ruleTree, ruleGroups)
    : undefined;

  return {
    loading: ruleTreeLoading || ruleGroupsLoading || valueDefinitionsLoading,
    error: ruleTreeError || ruleGroupsError || valueDefinitionsError,
    ruleGroups,
    ruleTree: namedRuleTree,
    valueDefinitions,
  };
};

export default useSecurityGuideData;
