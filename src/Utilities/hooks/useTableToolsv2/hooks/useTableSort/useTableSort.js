import { addSortableTransform, columnOffset } from './helpers';
import useTableState from '../useTableState';

// TODO implement onSetSortState to transform state put into the tablestate to be API consumable
/**
 * Provides columns with the `sortable` transform mixed in for a Patternfly table.
 *
 * @param {Array} columns Columns for a table
 * @param {Object} [options]
 */
const useTableSort = (columns, options = {}) => {
  const [sortBy, setSortBy] = useTableState(
    'sort',
    options.sortBy || {
      index: columnOffset(options),
      direction: 'asc',
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
