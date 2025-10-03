import useComplianceApi from 'Utilities/hooks/useComplianceApi';
import { useDeepCompareMemo, useDeepCompareCallback } from 'use-deep-compare';

import { useQueryWithUtilities } from 'bastilian-tabletools';
import {
  compileTotalResult,
  defaultCompileResult,
  paramsWithFilters,
  fetchResult,
  TOTAL_REQUEST_PARAMS,
  combineParamsWithTableState,
} from './helpers';

const useTableToolsQuery = (
  endpoint,
  {
    params: paramsOption = {},
    useTableState = false,
    batched = false,
    skip: skipOption,
    // batch = {},
    onlyTotal,
    convertToArray,
    // useQueryOptions = {},
    // compileResult,
    totalBatched = {},
  } = {},
) => {
  const apiEndpoint = useComplianceApi(endpoint);

  const fetchApi = useDeepCompareCallback(
    async (fetchParams = {}) => {
      const allParams = paramsWithFilters(
        { ...paramsOption, ...(onlyTotal ? TOTAL_REQUEST_PARAMS : {}) },
        fetchParams,
      );
      return await fetchResult(
        apiEndpoint,
        allParams,
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
      totalBatched,
      // ...useQueryOptions,
      // tableQueries: {
      //   itemIdsOnPageSelect: () => [], // workaround for data.map bug
      // }
    }),
    [
      fetchApi,
      endpoint,
      skipOption,
      batched,
      useTableState,
      paramsOption,
      totalBatched,
    ],
  );

  const {
    result: queryData,
    error: queryError,
    loading: queryLoading,
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
    query,
    queryTotalBatched,
    fetchBatchedQueue: queryBatchedQueue,
    fetchQueue: queryQueue,
    exporter,
    fetchAllIds: itemIdsInTable, // is it correct? or should it be itemIdsOnPage?
  };
};

export default useTableToolsQuery;
