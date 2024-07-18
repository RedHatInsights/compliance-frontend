import { useCallback, useState } from 'react';
import useTableState from '../useTableState';

// TODO implement onSetPaginationState to transform state put into the tablestate to be API consumable
/**
 * Provides `pagination` props and functionality for a (Primary)Toolbar
 *
 * @param {Object} [options]
 */
const usePagination = (options = {}) => {
  const { perPage = 10 } = options;
  const enablePagination = options?.pagination !== false;

  const [paginationState, setPaginationState] = useTableState('pagination', {
    perPage,
    page: 1,
  });
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
        pagination: paginationState,
        setPage,
        toolbarProps: {
          pagination: {
            ...paginationState,
            // TODO this needs to return a proper numberOfItems retrieved from somewhere and pass down here via options
            numberOfItems: 10,
            onSetPage: (_, page) => setPagination({ ...paginationState, page }),
            onPerPageSelect: (_, perPage) =>
              setPagination({ page: 1, perPage }),
          },
        },
      }
    : {};
};

export default usePagination;
