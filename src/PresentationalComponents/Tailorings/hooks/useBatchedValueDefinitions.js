import { useCallback } from 'react';
import useValueDefinitions from 'Utilities/hooks/api/useValueDefinitions';

import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';

const useBatchedValueDefinitions = (securityGuideId, { skip } = {}) => {
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
    skip,
  });

  return {
    loading: valueDefinitionsLoading,
    data: valueDefinitions,
    error: valueDefinitionsError,
  };
};

export default useBatchedValueDefinitions;
