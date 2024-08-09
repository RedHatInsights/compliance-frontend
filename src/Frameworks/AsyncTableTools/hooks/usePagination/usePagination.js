import { useCallback } from 'react';
import useTableState from '../useTableState';

/**
 * Provides `pagination` props and functionality for a (Primary)Toolbar
 * @category AsyncTableTools
 * @subcategory Hooks
 *
 * @param {object} [options] Options for the useAsyncTableTools hook
 *
 * @param {number} options.numberOfItems - The total number of items (required).
 * @param {number} options.perPage - A number that will dictate the amount of items shown per page.
 * @param {serialisers} options.serialisers - An object that will be passed into api params.
 *
 *  @returns {paginationToolbarProps} An object of props meant to be used in the {@link AsyncTableToolsTable}
 */
const usePagination = (options = {}) => {
  const { perPage = 10, serialisers, numberOfItems } = options;
  const enablePagination =
    options?.pagination !== false && (numberOfItems || 0) > perPage;

  const [paginationState, setPaginationState] = useTableState(
    'pagination',
    {
      perPage,
      page: 1,
    },
    {
      ...(serialisers?.pagination
        ? { serialiser: serialisers?.pagination }
        : {}),
    }
  );

  const setPagination = useCallback(
    (newState) =>
      setPaginationState({
        ...paginationState,
        ...newState,
      }),
    [setPaginationState]
  );

  const setPage = (page) => {
    const nextPage = page < 0 ? paginationState.page + page : page;
    setPagination({
      page: nextPage > 0 ? nextPage : 1,
    });
  };

  return enablePagination
    ? {
        setPage,
        toolbarProps: {
          pagination: {
            ...paginationState,
            itemCount: numberOfItems,
            onSetPage: (_, page) => setPagination({ ...paginationState, page }),
            onPerPageSelect: (_, perPage) =>
              setPagination({ page: 1, perPage }),
          },
        },
      }
    : {};
};

export default usePagination;
