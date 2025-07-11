import { useCallback } from 'react';
import {
  compileResult,
  compileTotalResult,
  TOTAL_REQUEST_PARAMS,
  fetchResult,
} from '../helpers';

const useComplianceFetchApi = ({
  apiEndpoint,
  params,
  convertToArray,
  onlyTotal,
}) => {
  const fetchApi = useCallback(
    async (fetchParams = {}) =>
      await fetchResult(
        apiEndpoint,
        {
          ...params,
          ...fetchParams,
          ...(onlyTotal ? TOTAL_REQUEST_PARAMS : {}),
        },
        convertToArray,
        onlyTotal ? compileTotalResult : compileResult,
      ),
    [apiEndpoint, params, convertToArray, onlyTotal],
  );

  const fetchForBatch = useCallback(
    async (offset, limit, fetchForBatchParams) =>
      await fetchApi({ ...fetchForBatchParams, offset, limit }),
    [fetchApi],
  );

  return { fetchApi, fetchForBatch };
};

export default useComplianceFetchApi;
