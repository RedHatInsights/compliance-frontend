import { useMemo } from 'react';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

/**
 *  @typedef {object} useComplianceQueryReturn
 *
 *  @property {object}   data    Response data
 *  @property {boolean}  loading Loading state
 *  @property {object}   error   Error from the endpoint
 *  @property {Function} refetch Refetch the endpoint
 */

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
 * Hook that passes serialised state from AsyncTableTools to the useQuery parameters
 * Make sure the component above is wrapped with `<TableStateProvider/>`.
 *
 *  @param   {Function}                 endpoint                   String of the javascript-clients export for the needed endpoint
 *
 *  @param   {object}                   [options]
 *  @param   {useComplianceQueryParams} [options.params]           API endpoint params
 *  @param   {boolean}                  [options.ignoreTableState] Force ignoring the serialised table state
 *
 *  @returns {useComplianceQueryReturn}                            Object containing state values and a refetch function
 *
 *  @category Compliance
 *  @subcategory Hooks
 *
 * @example
 *
 * const policiesApi = useComplianceQuery('policies')
 *
 * @example
 *
 * const policiesApi = useComplianceQuery('reports', {
 *  params: { filter: 'name NOT null'}
 * })
 *
 */
const useComplianceQuery = (
  endpoint,
  { params, ignoreTableState = false, ...options } = {}
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

  const paramsFromState = useMemo(
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
    params: !ignoreTableState ? paramsFromState : params,
    skip: !serialisedTableState,
    ...options,
  });

  return query;
};

export default useComplianceQuery;
