import { useCallback } from 'react';
import useValueDefinitions from 'Utilities/hooks/api/useValueDefinitions';
import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';

const useBatchedValueDefinitions = (options = {}) => {
  const { skip, batched = false, params } = options;
  const { fetch: fetchValueDefinitions } = useValueDefinitions({
    ...options,
    skip: skip || batched,
  });
  const fetchValueDefinitionsForBatch = useCallback(
    (offset, limit, params = {}) =>
      fetchValueDefinitions({ ...params, limit, offset }, false),
    [fetchValueDefinitions]
  );
  const {
    loading: valueDefinitionsLoading,
    data: valueDefinitions,
    error: valueDefinitionsError,
  } = useFetchTotalBatched(fetchValueDefinitionsForBatch, {
    params,
    skip: skip || !batched,
    withMeta: true,
  });

  return {
    loading: valueDefinitionsLoading,
    data: valueDefinitions,
    error: valueDefinitionsError,
  };
};

export default useBatchedValueDefinitions;
