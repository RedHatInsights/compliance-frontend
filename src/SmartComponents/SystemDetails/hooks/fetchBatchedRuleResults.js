import { useCallback } from 'react';
import useReportRuleResults from 'Utilities/hooks/api/useReportRuleResults';
import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';

const useBatchedRuleResults = (options = {}) => {
  const { skip, params } = options;
  const {
    data: rules,
    loading: rulesLoading,
    error: rulesError,
    fetch: fetchRules,
  } = useReportRuleResults({
    ...options,
    skip: skip,
  });
  const fetchRulesForBatch = useCallback(
    (offset, limit, params = {}) =>
      fetchRules({ ...params, limit, offset }, false),
    [fetchRules]
  );
  const { fetch: fetchBatched } = useFetchTotalBatched(fetchRulesForBatch, {
    params,
    skip: true,
    withMeta: true,
  });

  return {
    loading: rulesLoading,
    data: rules,
    error: rulesError,
    fetch,
    fetchBatched,
  };
};

export default useBatchedRuleResults;
