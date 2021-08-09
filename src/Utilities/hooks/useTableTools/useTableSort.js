import { useState } from 'react';
import { sortable } from '@patternfly/react-table';
import { orderArrayByProp, orderByArray, uniq } from 'Utilities/helpers';

const isSortable = (column) => column.sortByProp || column.sortByFunction;

const addSortableTransform = (columns) =>
  columns.map((column) => ({
    ...column,
    ...(isSortable(column)
      ? {
          transforms: uniq([...(column?.transforms || []), sortable]),
        }
      : {}),
  }));

const columnOffset = (options = {}) =>
  (typeof options.onSelect === 'function') +
  (typeof options.detailsComponent !== 'undefined');

const useTableSort = (columns, options = {}) => {
  const [sortBy, setSortBy] = useState({
    index: 0,
    direction: 'asc',
  });
  const onSort = (_, index, direction) =>
    setSortBy({
      index,
      direction,
    });

  return {
    sorter: (items) => {
      const column = columns[sortBy.index - columnOffset(options)];
      return column?.sortByArray
        ? orderByArray(
            items,
            column?.sortByProp,
            column?.sortByArray,
            sortBy.direction
          )
        : orderArrayByProp(
            column?.sortByProp || column?.sortByFunction,
            items,
            sortBy.direction
          );
    },
    tableProps: {
      onSort,
      sortBy,
      cells: addSortableTransform(columns),
    },
  };
};

export default useTableSort;
