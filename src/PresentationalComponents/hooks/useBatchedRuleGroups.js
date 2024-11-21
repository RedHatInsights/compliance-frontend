import { useCallback } from 'react';
import useRuleGroups from 'Utilities/hooks/api/useRuleGroups';
import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';

const useBatchedRuleGroups = (securityGuideId, { skip } = {}) => {
  const { fetch: fetchRuleGroups } = useRuleGroups({
    params: [securityGuideId],
    skip: true,
  });
  const fetchRuleGroupsForBatch = useCallback(
    (offset, limit) =>
      fetchRuleGroups([securityGuideId, undefined, limit, offset], false),
    [fetchRuleGroups, securityGuideId]
  );
  const {
    loading: ruleGroupsLoading,
    data: ruleGroups,
    error: ruleGroupsError,
  } = useFetchTotalBatched(fetchRuleGroupsForBatch, {
    batchSize: 60,
    skip,
  });

  return {
    loading: ruleGroupsLoading,
    data: ruleGroups,
    error: ruleGroupsError,
  };
};

export default useBatchedRuleGroups;
