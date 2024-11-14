import { useCallback } from 'react';
import useTailoringRules from 'Utilities/hooks/api/useTailoringRules';
import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';

const useBatchedTailoringRules = (options = {}) => {
  const { skip, batched = false, params } = options;
  const {
    data: rules,
    loading: rulesLoading,
    error: rulesError,
    fetch: fetchRules,
  } = useTailoringRules({
    ...options,
    skip: skip || batched,
  });
  const fetchRulesForBatch = useCallback(
    (offset, limit, params = {}) =>
      fetchRules({ ...params, limit, offset }, false),
    [fetchRules]
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
    data: rules || rulesBatched,
    error: rulesError || rulesBatchedError,
    fetch,
    fetchBatched,
  };
};

export default useBatchedTailoringRules;
