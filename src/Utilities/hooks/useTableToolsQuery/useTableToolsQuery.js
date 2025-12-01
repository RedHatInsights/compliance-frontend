import useComplianceApi from 'Utilities/hooks/useComplianceApi';
import { useDeepCompareMemo, useDeepCompareCallback } from 'use-deep-compare';

import { useQueryWithUtilities } from 'bastilian-tabletools';
import {
  compileTotalResult,
  defaultCompileResult,
  fetchResult,
  TOTAL_REQUEST_PARAMS,
  combineParamsWithTableState,
  hasRequiredParams,
} from './helpers';

const useTableToolsQuery = (
  endpoint,
  {
    params: paramsOption = {},
    requiredParams,
    useTableState = false,
    batched = false,
    skip: skipOption,
    batch = {},
    onlyTotal,
    convertToArray,
    useQueryOptions = {},
  } = {},
) => {
  const apiEndpoint = useComplianceApi(endpoint);
  !skipOption && hasRequiredParams(requiredParams, paramsOption);

  const fetchApi = useDeepCompareCallback(
    async (fetchParams = {}) => {
      const allFetchParams = {
        ...fetchParams,
        ...(onlyTotal ? TOTAL_REQUEST_PARAMS : {}),
      };
      return await fetchResult(
        apiEndpoint,
        allFetchParams,
        convertToArray,
        onlyTotal ? compileTotalResult : defaultCompileResult,
      );
    },
    [apiEndpoint, paramsOption, convertToArray, onlyTotal],
  );

  const queryOptions = useDeepCompareMemo(
    () => ({
      fetchFn: fetchApi,
      queryKey: [endpoint],
      enabled: !skipOption,
      batched,
      useTableState,
      params: paramsOption,
      combineParamsWithTableState,
      totalBatched: batch,
      tableQueries: useQueryOptions,
    }),
    [
      fetchApi,
      endpoint,
      skipOption,
      batched,
      useTableState,
      paramsOption,
      batch,
      useQueryOptions,
    ],
  );

  const {
    result: queryData,
    error: queryError,
    loading: queryLoading,
    refetch,
    query: query,
    queryTotalBatched,
    queryQueue,
    queryBatchedQueue,
    itemIdsInTable,
    exporter,
  } = useQueryWithUtilities(queryOptions);

  return {
    data: queryData,
    error: queryError,
    loading: queryLoading,
    refetch,
    query,
    queryTotalBatched,
    fetchBatchedQueue: queryBatchedQueue,
    fetchQueue: queryQueue,
    exporter,
    fetchAllIds: itemIdsInTable,
  };
};

export default useTableToolsQuery;
