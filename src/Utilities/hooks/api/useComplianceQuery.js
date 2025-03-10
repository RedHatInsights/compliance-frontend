import { useCallback } from 'react';
import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';
import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';
import useComplianceTableState from './useComplianceTableState';

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
 *
 * Hook to use a Compliance REST API v2 endpoint with useQuery.
 * Optionally support for using the serialised table state if a `<TableStateProvider/>` is available.
 *
 *  @param   {Function}                 endpoint                String of the javascript-clients export for the needed endpoint
 *
 *  @param   {object}                   [options]               Options for useComplianceQuery & useQuery
 *  @param   {useComplianceQueryParams} [options.params]        API endpoint params
 *  @param   {boolean}                  [options.useTableState] Use the serialised table state
 *
 *  @param                              options.batched
 *  @param                              options.skip
 *  @returns {useQueryReturn}                                   An object containing a data, loading and error state, as well as a fetch and refetch function.
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
    params: paramsOption,
    useTableState = false,
    batched = false,
    skip: skipOption,
    ...options
  } = {}
) => {
  const apiEndpoint = useComplianceApi(endpoint);
  const { params, hasState } = useComplianceTableState(
    useTableState,
    paramsOption
  );
  const skip = !!(useTableState && !hasState) || !!skipOption;

  const {
    data: queryData,
    error: queryError,
    loading: queryLoading,
    fetch: queryFetch,
  } = useQuery(apiEndpoint, {
    skip: batched ? true : skip,
    ...options,
    params,
  });

  const fetchForBatch = useCallback(
    async (offset, limit, params) =>
      await queryFetch({ limit, offset, ...params }, false),
    [queryFetch]
  );

  const {
    loading: batchedLoading,
    data: batchedData,
    error: batchedError,
    fetch: batchedFetch,
  } = useFetchTotalBatched(fetchForBatch, {
    skip: !batched ? true : skip,
  });

  // TODO We can implement a function to be returned that calls fetchBatched and returns the `data` property for exporting
  // TODO Something similar as ^ can be done for the "itemIdsInTable" function we need for all tables, but by calling batched with { idsOnly: true }

  return {
    ...(batched
      ? {
          data: batchedData,
          error: batchedError,
          loading: batchedLoading,
        }
      : {
          data: queryData,
          error: queryError,
          loading: queryLoading,
        }),
    fetch: queryFetch,
    fetchBatched: batchedFetch,
  };
};

export default useComplianceQuery;
