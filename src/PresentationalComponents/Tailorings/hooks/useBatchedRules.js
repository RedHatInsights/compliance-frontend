import { useCallback } from 'react';
import useRules from 'Utilities/hooks/api/useRules';
import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';

const useBatchedRules = (options = {}) => {
  const { skip, batched = false, params } = options;
  const {
    data: rules,
    loading: rulesLoading,
    error: rulesError,
    fetch: fetchRules,
  } = useRules({
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
    data: !batched ? rules : rulesBatched,
    error: rulesError || rulesBatchedError,
    fetch,
    fetchBatched,
  };
};

export default useBatchedRules;
