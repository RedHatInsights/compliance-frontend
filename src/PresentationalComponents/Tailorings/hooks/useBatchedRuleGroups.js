import { useCallback } from 'react';
import useRuleGroups from 'Utilities/hooks/api/useRuleGroups';
import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';

const useBatchedRuleGroups = (options = {}) => {
  const { skip, batched = false, params } = options;
  const { fetch: fetchRuleGroups } = useRuleGroups({
    ...options,
    skip: skip || batched,
  });
  const fetchRuleGroupsForBatch = useCallback(
    async (offset, limit, params = {}) =>
      await fetchRuleGroups({ ...params, limit, offset }, false),
    [fetchRuleGroups]
  );
  const {
    loading: ruleGroupsLoading,
    data: ruleGroups,
    error: ruleGroupsError,
  } = useFetchTotalBatched(fetchRuleGroupsForBatch, {
    params,
    skip: skip || !batched,
    withMeta: true,
  });

  return {
    loading: ruleGroupsLoading,
    data: ruleGroups,
    error: ruleGroupsError,
  };
};

export default useBatchedRuleGroups;
