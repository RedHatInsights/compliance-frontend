import { useMemo } from 'react';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

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
  { params, useTableState = false, ...options } = {}
) => {
  const apiEndpoint = useComplianceApi(endpoint);
  const serialisedTableState = useSerialisedTableState();
  const {
    filters,
    pagination: { offset, limit } = {},
    sort: sortBy,
  } = serialisedTableState || {};

  const filter = useMemo(
    () =>
      params?.filter
        ? `(${params.filter})${filters ? ` AND ${filters}` : ''}`
        : filters,
    [params, filters]
  );

  const paramsFromSerialisedTableState = useMemo(
    () => ({
      limit,
      offset,
      sortBy,
      ...params,
      filter,
    }),
    [limit, offset, filter, sortBy, params]
  );

  const query = useQuery(apiEndpoint, {
    params: useTableState ? paramsFromSerialisedTableState : params,
    skip: useTableState && !serialisedTableState,
    ...options,
  });

  return query;
};

export default useComplianceQuery;
