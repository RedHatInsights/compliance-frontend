import { useCallback } from 'react';
import useSecurityGuideRuleTree from 'Utilities/hooks/api/useSecurityGuideRuleTree';
import useRuleGroups from 'Utilities/hooks/api/useRuleGroups';
import useValueDefinitions from 'Utilities/hooks/api/useValueDefinitions';

import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';
import { buildTreeTable } from '../helpers';

const useSecurityGuideData = (
  security_guide_id,
  { skipRuleTree, skipRuleGroups, skipValueDefinitions }
) => {
  const {
    data: ruleTree,
    loading: ruleTreeLoading,
    error: ruleTreeError,
  } = useSecurityGuideRuleTree(security_guide_id, {
    skip: skipRuleTree,
  });

  const { fetch: fetchRuleGroups } = useRuleGroups(security_guide_id, {
    skip: true,
  });
  const fetchRuleGroupsForBatch = useCallback(
    (offset, limit) =>
      fetchRuleGroups([security_guide_id, undefined, limit, offset], false),
    [fetchRuleGroups, security_guide_id]
  );
  const {
    loading: ruleGroupsLoading,
    data: ruleGroups,
    error: ruleGroupsError,
  } = useFetchTotalBatched(fetchRuleGroupsForBatch, {
    batchSize: 60,
    skip: skipRuleGroups,
  });

  const { fetch: fetchValueDefinitions } = useValueDefinitions(
    security_guide_id,
    { skip: true }
  );
  const fetchValueDefinitionsForBatch = useCallback(
    (offset, limit) =>
      fetchValueDefinitions(
        [security_guide_id, undefined, limit, offset],
        false
      ),
    [fetchValueDefinitions, security_guide_id]
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
