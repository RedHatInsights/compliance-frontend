import { useQuery } from '@tanstack/react-query';
import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';
import useComplianceApi from 'Utilities/hooks/useComplianceApi';

import useComplianceTableState from './hooks/useComplianceTableState';
import useComplianceFetchExtras from './hooks/useComplianceFetchExtras';
import useComplianceFetchApi from './hooks/useComplianceFetchApi';
import { useQueryWithUtilities } from 'bastilian-tabletools';
import { useCallback } from 'react';
import { end } from '@patternfly/react-core/dist/esm/helpers/Popper/thirdparty/popper-core';

/**
 *  @typedef {object} useComplianceQueryParams
 *
 *  @property {string} [filter]            Scoped search filter string for the endpoint
 *  @property {object} [pagination]        API pagination params
 *  @property {object} [pagination.offset] Pagination offset
 *  @property {object} [pagination.limit]  Pagination limit (maximum 100)
 *  @property {object} [sortBy]            SortBy string for the API (usually 'attribute:desc')
 *
 */

/**
 *  @typedef {object} useComplianceQueryReturn
 *
 *  @property {object}   data              Property that contains the request response
 *  @property {object}   error             Property that contains the request error
 *  @property {boolean}  loading           Wether or not the requests are currently loading
 *  @property {Function} fetch             Fetch function to call fetches on demand
 *  @property {Function} fetchBatched      Fetch function to call batched fetches on demand
 *  @property {Function} fetchQueue        Function that can be called with a "queue"/array of params object or an object with key paramsObject pairs to call fetch with
 *  @property {Function} fetchBatchedQueue Function that can be called with a "queue"/array of params object or an object with key paramsObject pairs to call fetchBatched with
 *  @property {Function} fetchAllIds       Fetch function to call a batched fetch of all ids (with the idsOnly param) on demand
 *  @property {Function} exporter          Fetch function to call a batched fetch of all data and return the objects on demand (can be passed as exporter to Table Tools)
 *
 */

/**
 *
 * Hook to use a Compliance REST API v2 endpoint with useQuery. Optionally support for using the serialised table state if a `<TableStateProvider/>` is available.
 *
 *  @param   {Function}                 endpoint                 String of the javascript-clients export for the needed endpoint
 *  @param   {object}                   [options]                Options for useComplianceQuery & useQuery
 *  @param   {useComplianceQueryParams} [options.params]         API endpoint params
 *  @param   {boolean}                  [options.useTableState]  Use the serialised table state
 *  @param   {boolean}                  [options.batched]        Wether or not requests should be batched
 *  @param   {boolean}                  [options.skip]           Wether or not to skip the request
 *  @param   {object}                   [options.batch]          Options to be passed to the useFetchTotalBatched
 *  @param   {boolean}                  [options.onlyTotal]      Enables a predefined "compileResult" function for the useQuery to only return the meta.total as the `data`
 *  @param   {Array | string}           [options.requiredParams] Parameters required for the endpoint. The request will be "skipped" until all parameters are provided.
 *
 *  @param                              options.convertArray
 *  @param                              options.convertToArray
 *  @param                              options.compileResult
 *  @param                              options.useQueryOptions
 *  @returns {useComplianceQueryReturn}                          An object containing a data, loading and error state, as well as a fetch and fetchBatched function.
 *
 *  @category Compliance
 *  @subcategory Hooks
 *
 * @example
 *
 * // Will return a `useQuery` result with data, loading, error
 * const { data, loading, error } = useComplianceQuery('policies')
 *
 * // Will return a `useQuery` result with a filter passed to the API
 * const reportsApi = useComplianceQuery('reports', {
 *  params: { filter: 'name NOT null'}
 * })
 *
 * // Will return a `useQuery` result using the sort, pagination and filter state from a TableStateProvider passed as params to the API
 * const reportsApi = useComplianceQuery('reports', {
 *  useTableState: true
 * })
 *
 * // Will do the same as above, but additionally add a default filter to the tables filter
 * const reportsApi = useComplianceQuery('reports', {
 *  params: { filter: 'name NOT null' },
 *  useTableState: true
 * })
 *
 * // Will use the table state for pagination and filters, but always use the 'name:asc' for every request
 * const reportsApi = useComplianceQuery('reports', {
 *  params: { sortBy: 'name:asc' },
 *  useTableState: true
 * })
 *
 */
const useComplianceQuery = (
  endpoint,
  {
    params: paramsOption = [],
    useTableState = false,
    batched = false,
    skip: skipOption,
    batch = {},
    onlyTotal,
    convertToArray,
    useQueryOptions = {},
    compileResult,
  } = {},
) => {
  // TODO refactor useComplianceQuery to centralise "convertToArray" functions
  const apiEndpoint = useComplianceApi(endpoint);
  // const { params, hasState } = useComplianceTableState(
  //   useTableState,
  //   paramsOption,
  // );
  // console.log("DEBUG params", params)
  // const skip = !!(useTableState && !hasState) || !!skipOption;

  // console.log("DEBUG endpoint", endpoint)
  if (endpoint === 'reports') {
    console.log("DEBUG params", { paramsOption, useTableState, batched, skipOption, batch, onlyTotal, convertToArray,useQueryOptions, compileResult })
  }
  // if (endpoint === 'reportRuleResults') {
  //   console.log("DEBUG paramsOptions", paramsOption)
  //   console.log("DEBUG skipOption", skipOption)
  // }

  const fetchApi = useComplianceFetchApi({
    apiEndpoint,
    params: paramsOption,
    convertToArray,
    onlyTotal,
    compileResult,
  });
  const myCoolParams = convertToArray(paramsOption);
  // console.log("DEBUG myCoolParams", myCoolParams)

  // const fetchFn = useCallback(
  //   async (params) => {
  //     console.log("DEBUG params", params)
  //     const convertedParams =
  //     (convertToArray && Object.keys(params).length !== 0 && !Array.isArray(params)
  //       ? convertToArray(params)
  //       : []);
      
  //     console.log("DEBUG convertedParams", convertedParams)
  
  //     const { data } = await apiEndpoint(...(convertedParams || []));

  //     return data;
  //   },
  //   [endpoint],
  // );

  // exporter
  // itemIdsInTable
  // itemIdsOnPage
  // items
  // loading
  // query
  // queryBatchedQueue
  // queryQueue
  // queryTotalBatched
  // result
  const resp = useQueryWithUtilities({
    // fetchFn: (_queryContext, ...args) => fetchApi(...args),
    fetchFn: fetchApi,
    queryKey: [endpoint, ...myCoolParams],
    enabled: !skipOption,
    batched: batched,
    useTableState: useTableState,
    params: paramsOption,
    queue: batched,
    // ...useQueryOptions,
    tableQueries: {
      itemIdsOnPageSelect: () => [], // workaround for data.map bug
    }
  })

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
  } = resp;
  // console.log("DEBUG resp", resp)


  return {
    data: queryData,
    error: queryError,
    loading: queryLoading,
    query: query,
    queryTotalBatched: queryTotalBatched,  // is it correct?
    fetch: fetchApi,
    fetchBatchedQueue: queryBatchedQueue,  // is it correct?
    fetchQueue: queryQueue, // is it correct?
    exporter: exporter,
    fetchAllIds: itemIdsInTable, // is it correct? or should it be itemIdsOnPage?
  };
  
  // const {
  //   data: queryData,
  //   error: queryError,
  //   isFetching: queryLoading,
  //   refetch: queryRefetch,
  // } = useQuery({
  //   queryKey: [endpoint, params],
  //   queryFn: (_queryContext, ...args) => fetchApi(...args),
  //   enabled: !(batched ? true : skip),
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: false,
  //   ...useQueryOptions,
  // });

  // const {
  //   loading: batchedLoading,
  //   data: batchedData,
  //   error: batchedError,
  //   fetch: fetchBatched,
  // } = useFetchTotalBatched(fetchForBatch, {
  //   skip: !batched ? true : skip,
  //   ...batch,
  // });

  // const extras = useComplianceFetchExtras({
  //   fetch: fetchApi,
  //   fetchBatched,
  //   params,
  // });

  // return {
  //   ...(batched
  //     ? {
  //         data: batchedData,
  //         error: batchedError,
  //         loading: batchedLoading,
  //       }
  //     : {
  //         data: queryData,
  //         error: queryError,
  //         loading: queryLoading,
  //       }),
  //   fetch: fetchApi,
  //   fetchBatched,
  //   refetch: queryRefetch,
  //   ...extras,
  // };
};

export default useComplianceQuery;
