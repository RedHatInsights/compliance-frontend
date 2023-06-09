import { useState, useCallback } from 'react';
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
  (typeof options.onSelect === 'function' || options.hasRadioSelect ? 1 : 0) +
  (typeof options.detailsComponent !== 'undefined');

const sortByFromOptions = (options = {}) => ({
  index:
    options.tableType === 'tree'
      ? options.sortBy?.index - 1
      : options.sortBy?.index || 1,
  direction: options.sortBy?.direction || 'asc',
});

const useTableSort = (columns, options = {}) => {
  const [sortBy, setSortBy] = useState(sortByFromOptions(options));
  const onSort = (_, index, direction) => {
    setSortBy({
      index,
      direction,
    });
  };

  const sorter = useCallback(
    (items) => {
      const currentSortableColumn =
        columns[
          sortBy.index -
            (options.tableType === 'tree' ? 0 : columnOffset(options)) -
            1
        ];
      return currentSortableColumn?.sortByArray
        ? orderByArray(
            items,
            currentSortableColumn?.sortByProp,
            currentSortableColumn?.sortByArray,
            sortBy.direction
          )
        : orderArrayByProp(
            currentSortableColumn?.sortByProp ||
              currentSortableColumn?.sortByFunction,
            items,
            sortBy.direction
          );
    },
    [sortBy, columns, options.tableType]
  );

  return {
    sorter,
    tableProps: {
      onSort,
      sortBy,
      cells: addSortableTransform(columns),
    },
  };
};

export const useTableSortWithItems = (items, columns, options) => {
  const { tableProps, sorter } = useTableSort(columns, options);

  return {
    tableProps: {
      ...tableProps,
      sortBy: items.length > 0 ? tableProps.sortBy : undefined,
    },
    sorter,
  };
};

export default useTableSort;
