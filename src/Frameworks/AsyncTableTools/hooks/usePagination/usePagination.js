import { useCallback, useMemo } from 'react';
import { TABLE_STATE_NAMESPACE as FILTERS_TABLE_NAMESPACE } from '../useFilterConfig/constants';
import { TABLE_STATE_NAMESPACE as SORT_TABLE_NAMESPACE } from '../useTableSort/constants';

import useTableState from '../useTableState';
import { TABLE_STATE_NAMESPACE } from './constants';

/**
 * Provides `pagination` props and functionality for a (Primary)Toolbar
 *
 *  @param   {object}   [options]                        AsyncTableTools options
 *  @param   {number}   options.numberOfItems            The total number of items (required).
 *  @param   {number}   [options.perPage]                A number that will dictate the amount of items shown per page.
 *  @param   {Function} [options.serialisers.pagination] A function to provide a serialiser for the table state
 *
 *  @returns {object}                                    An object of props meant to be used in the {@link AsyncTableToolsTable}
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const usePagination = (options = {}) => {
  const { perPage = 10, serialisers, numberOfItems } = options;
  const enablePagination =
    options?.pagination !== false && (numberOfItems || 0) > perPage;
  const stateObservers = useMemo(
    () => ({
      [SORT_TABLE_NAMESPACE]: (currentState) => ({
        ...currentState,
        page: 1,
      }),
      [FILTERS_TABLE_NAMESPACE]: (currentState) => ({
        ...currentState,
        page: 1,
      }),
    }),
    []
  );
  const [paginationState, setPaginationState] = useTableState(
    TABLE_STATE_NAMESPACE,
    {
      perPage,
      page: 1,
    },
    {
      ...(serialisers?.pagination
        ? { serialiser: serialisers?.pagination }
        : {}),
      observers: stateObservers,
    }
  );

  const setPagination = useCallback(
    (newState) =>
      setPaginationState({
        ...paginationState,
        ...newState,
      }),
    [setPaginationState, paginationState]
  );

  const setPage = useCallback(
    (page) => {
      const nextPage = page < 0 ? paginationState.page + page : page;
      setPagination({
        page: nextPage > 0 ? nextPage : 1,
      });
    },
    [setPagination, paginationState]
  );

  return enablePagination
    ? {
        toolbarProps: {
          pagination: {
            ...paginationState,
            itemCount: numberOfItems,
            onSetPage: (_, page) => setPage(page),
            onPerPageSelect: (_, perPage) =>
              setPagination({ page: 1, perPage }),
          },
        },
      }
    : {};
};

export default usePagination;
