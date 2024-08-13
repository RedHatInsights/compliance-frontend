import { addSortableTransform, columnOffset } from './helpers';
import useTableState from '../useTableState';

/**
 *  Provides columns with the `sortable` transform mixed in for a Patternfly table.
 *
 *  @param {Array} columns Columns for a table, with a "sortable" prop
 *  @param {object} [options] AsyncTableTools options
 *  @param {object} [options.sortBy] An initial sortBy state like `{index: 1, direction: 'desc'}`
 *  @param {object} [options.onSort] A function to call after setting a new sort state.
 *  @param {object} [options.serialisers.sort] A function to provide a serialiser for the table state
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
  const { sortBy: initialSortBy, serialisers } = options;
  const defaultSortBy = {
    index: columnOffset(options),
    direction: 'asc',
  };
  const [sortBy, setSortBy] = useTableState(
    'sort',
    initialSortBy || defaultSortBy,
    {
      ...(serialisers?.sort
        ? { serialiser: (state) => serialisers.sort(state, columns) }
        : {}),
    }
  );

  const onSort = (_, index, direction) => {
    setSortBy({
      index,
      direction,
    });
    options.onSort?.(index, direction);
  };

  return {
    sortBy,
    tableProps: {
      onSort,
      sortBy,
      cells: addSortableTransform(columns),
    },
  };
};

export default useTableSort;
