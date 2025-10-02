import useComplianceApi from 'Utilities/hooks/useComplianceApi';

import { useQueryWithUtilities } from 'bastilian-tabletools';
import { useCallback, useMemo } from 'react';
import {
  compileTotalResult,
  defaultCompileResult,
  paramsWithFilters,
  fetchResult,
  TOTAL_REQUEST_PARAMS,
} from './helpers';

const useTableToolsQuery = (
  endpoint,
  {
    params: paramsOption = [],
    useTableState = false,
    batched = false,
    skip: skipOption,
    // batch = {},
    onlyTotal,
    convertToArray,
    // useQueryOptions = {},
    // compileResult,
    totalBatched,
  } = {},
) => {
  const apiEndpoint = useComplianceApi(endpoint);

  const fetchApi = useCallback(
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

  const convertedParams = useMemo(
    () => convertToArray(paramsOption),
    [convertToArray, paramsOption],
  );

  const combineParamsWithTableState = useCallback(
    (tableStateParams, additionalParams) => {
      const tableFilters = tableStateParams?.filters;
      const optionFilters = additionalParams?.filters;

      const combinedParams = {
        ...(tableStateParams ? tableStateParams : {}),
        ...(additionalParams ? additionalParams : {}),
      };
      if (tableFilters && optionFilters) {
        combinedParams.filters = `${tableFilters} AND ${optionFilters}`;
      }
      return combinedParams;
    },
    [],
  );

  const resp = useQueryWithUtilities({
    fetchFn: fetchApi,
    queryKey: [endpoint, ...convertedParams],
    enabled: !skipOption,
    batched: batched,
    useTableState: useTableState,
    params: paramsOption,
    // queue: batched,
    combineParamsWithTableState,
    totalBatched,
    // ...useQueryOptions,
    // tableQueries: {
    //   itemIdsOnPageSelect: () => [], // workaround for data.map bug
    // }
  });

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
    // items,
  } = resp;
  // console.log('DEBUG resp', resp);

  return {
    data: queryData,
    error: queryError,
    loading: queryLoading,
    query,
    queryTotalBatched,
    fetch: fetchApi,
    fetchBatchedQueue: queryBatchedQueue,
    fetchQueue: queryQueue,
    exporter,
    fetchAllIds: itemIdsInTable, // is it correct? or should it be itemIdsOnPage?
  };
};

export default useTableToolsQuery;
