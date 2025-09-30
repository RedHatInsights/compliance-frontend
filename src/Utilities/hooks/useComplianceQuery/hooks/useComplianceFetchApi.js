import { useCallback } from 'react';
import {
  defaultCompileResult,
  compileTotalResult,
  TOTAL_REQUEST_PARAMS,
  fetchResult,
  paramsWithFilters,
} from '../helpers';

const useComplianceFetchApi = ({
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
      return await fetchResult(
        apiEndpoint,
        allParams,
        convertToArray,
        onlyTotal ? compileTotalResult : compileResult,
      );
    },
    [apiEndpoint, params, convertToArray, onlyTotal, compileResult],
  );

  const fetchForBatch = useCallback(
    async (offset, limit, fetchForBatchParams) =>
      await fetchApi({ ...fetchForBatchParams, offset, limit }),
    [fetchApi],
  );

  return { fetchApi, fetchForBatch };
};

export default useComplianceFetchApi;
