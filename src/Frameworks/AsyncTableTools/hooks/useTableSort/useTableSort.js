import { useCallback, useMemo } from 'react';
import { addSortableTransform, columnOffset } from './helpers';
import useTableState from '../useTableState';
import { TABLE_STATE_NAMESPACE } from './constants';

/**
 * Provides columns with the `sortable` transform mixed in for a Patternfly table.
 *
 *  @param   {Array}  columns                    Columns for a table, with a "sortable" prop
 *  @param   {object} [options]                  AsyncTableTools options
 *  @param   {object} [options.sortBy]           An initial sortBy state like `{index: 1, direction: 'desc'}`
 *  @param   {object} [options.onSort]           A function to call after setting a new sort state.
 *  @param   {object} [options.serialisers.sort] A function to provide a serialiser for the table state
 *
 *  @returns {object}
 *
 *  @example
 *
 * const columns = [{ title: 'Name', sortable: true }]
 * const tableSort = useTableSort(columns)
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useTableSort = (columns, options = {}) => {
  const {
    sortBy: initialSortBy,
    serialisers,
    onSelect,
    detailsComponent,
    onSort: onSortOption,
  } = options;
  const defaultSortBy = useMemo(
    () =>
      initialSortBy || {
        index: columnOffset({
          detailsComponent,
          onSelect,
        }),
        direction: 'asc',
      },
    [detailsComponent, onSelect, initialSortBy]
  );

  const serialiser = useCallback(
    (state) => options.serialisers.sort(state, columns),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(columns), JSON.stringify(options.serialisers)]
  );
  const stateOptions = useMemo(
    () => ({
      ...(serialisers?.sort
        ? {
            serialiser,
          }
        : {}),
    }),
    [serialisers, serialiser]
  );
  const [sortBy, setSortBy] = useTableState(
    TABLE_STATE_NAMESPACE,
    defaultSortBy,
    stateOptions
  );

  const onSort = useCallback(
    (_, index, direction) => {
      setSortBy({
        index,
        direction,
      });
      onSortOption?.(index, direction);
    },
    [onSortOption, setSortBy]
  );

  return {
    sortBy: sortBy || defaultSortBy,
    tableProps: {
      onSort,
      sortBy: sortBy || defaultSortBy,
      cells: addSortableTransform(columns),
    },
  };
};

export default useTableSort;
