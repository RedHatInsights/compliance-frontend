import { useCallback } from 'react';
import { isIopApiMocksEnabled } from 'Utilities/mocks/iopApiMocksEnabled';
import { getIopMockResponse } from 'Utilities/mocks/getIopMockResponse';
import {
  defaultCompileResult,
  compileTotalResult,
  TOTAL_REQUEST_PARAMS,
  fetchResult,
  paramsWithFilters,
} from '../helpers';

const useComplianceFetchApi = ({
  endpoint,
  apiEndpoint,
  params,
  convertToArray,
  onlyTotal,
  compileResult = defaultCompileResult,
}) => {
  const fetchApi = useCallback(
    async (fetchParams = {}) => {
      const allParams = Array.isArray(fetchParams)
        ? fetchParams
        : paramsWithFilters(
            { ...params, ...(onlyTotal ? TOTAL_REQUEST_PARAMS : {}) },
            fetchParams,
          );

      if (isIopApiMocksEnabled()) {
        return getIopMockResponse(endpoint, allParams, { onlyTotal });
      }

      return await fetchResult(
        apiEndpoint,
        allParams,
        convertToArray,
        onlyTotal ? compileTotalResult : compileResult,
      );
    },
    [apiEndpoint, endpoint, params, convertToArray, onlyTotal, compileResult],
  );

  const fetchForBatch = useCallback(
    async (offset, limit, fetchForBatchParams) =>
      await fetchApi({ ...fetchForBatchParams, offset, limit }),
    [fetchApi],
  );

  return { fetchApi, fetchForBatch };
};

export default useComplianceFetchApi;
