import { useCallback } from 'react';
import useTableState from '../useTableState';

/**
 * Provides `pagination` props and functionality for a (Primary)Toolbar
 *
 * @param {Object} [options]
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
            // TODO this needs to return a proper numberOfItems retrieved from somewhere and pass down here via options
            numberOfItems,
            onSetPage: (_, page) => setPagination({ ...paginationState, page }),
            onPerPageSelect: (_, perPage) =>
              setPagination({ page: 1, perPage }),
          },
        },
      }
    : {};
};

export default usePagination;
