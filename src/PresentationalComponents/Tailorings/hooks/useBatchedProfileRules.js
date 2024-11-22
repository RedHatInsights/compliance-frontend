import { useCallback } from 'react';
import useProfileRules from 'Utilities/hooks/api/useProfileRules';
import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';

const useBatchedProfileRules = (options = {}) => {
  const { skip, batched = false, params } = options;
  const {
    data: rules,
    loading: rulesLoading,
    error: rulesError,
    fetch: fetchProfileRules,
  } = useProfileRules({
    ...options,
    skip: skip || batched,
  });

  const fetchRulesForBatch = useCallback(
    async (offset, limit, params = {}) =>
      await fetchProfileRules({ ...params, limit, offset }, false),
    [fetchProfileRules]
  );
  const {
    loading: rulesBatchedLoading,
    data: rulesBatched,
    error: rulesBatchedError,
    fetch: fetchBatched,
  } = useFetchTotalBatched(fetchRulesForBatch, {
    params,
    skip: skip || !batched,
    withMeta: true,
  });

  return {
    loading: rulesLoading || rulesBatchedLoading,
    data: !batched ? rules : rulesBatched,
    error: rulesError || rulesBatchedError,
    fetch,
    fetchBatched,
  };
};

export default useBatchedProfileRules;
