import { useCallback } from 'react';
import usePaginationState from './hooks/usePaginationState';

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
  const { numberOfItems, pagination = true } = options;
  const [paginationState, setPaginationState] = usePaginationState(options);

  const setPagination = useCallback(
    (newState) =>
      setPaginationState((paginationState) => ({
        ...paginationState,
        state: {
          ...paginationState.state,
          ...newState,
        },
      })),
    [setPaginationState]
  );

  const setPage = useCallback(
    (page) => {
      setPaginationState((paginationState) => {
        const nextPage = page < 0 ? paginationState.page + page : page;
        return {
          ...(paginationState || {}),
          state: {
            ...(paginationState?.state || {}),
            page: nextPage > 0 ? nextPage : 1,
          },
        };
      });
    },
    [setPaginationState]
  );

  return pagination && !(paginationState || {}).isDisabled
    ? {
        toolbarProps: {
          pagination: {
            ...(paginationState?.state || {}),
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
