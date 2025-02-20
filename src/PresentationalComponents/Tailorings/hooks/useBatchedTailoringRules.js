import { useCallback } from 'react';
import useTailoringRules from 'Utilities/hooks/api/useTailoringRules';
import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';

const useBatchedTailoringRules = (options = {}) => {
  const { skip, batched = false } = options;
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
    async (offset, limit) => await fetchRules({ limit, offset }, false),
    [fetchRules]
  );
  const {
    loading: rulesBatchedLoading,
    data: rulesBatched,
    error: rulesBatchedError,
    fetch: fetchBatched,
  } = useFetchTotalBatched(fetchRulesForBatch, {
    skip: skip || !batched,
  });
  return {
    loading: !batched ? rulesLoading : rulesLoading || rulesBatchedLoading,
    data: !batched ? rules : rulesBatched,
    error: rulesError || rulesBatchedError,
    fetch,
    fetchBatched,
  };
};

export default useBatchedTailoringRules;
