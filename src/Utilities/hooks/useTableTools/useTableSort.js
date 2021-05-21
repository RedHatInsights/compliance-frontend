import { useState } from 'react';
import { sortable } from '@patternfly/react-table';
import { orderArrayByProp, orderByArray, uniq } from 'Utilities/helpers';

const isSortable = (column) => (
    column.sortByProp || column.sortByFunction
);

const addSortableTransform = (columns) => (
    columns.map((column) => ({
        ...column,
        ...isSortable(column) ? {
            transforms: uniq([
                ...(column?.transforms || []),
                sortable
            ])
        } : {}
    }))
);

const columnOffset = (options = {}) => ([
    ...(typeof options.onSelect === 'function') ? [1] : [],
    ...(typeof options.detailsComponent  !== 'undefined') ? [1] : []
].reduce((a, b) => (a + b), 0));

const useTableSort = (columns, options = {}) => {
    const [sortBy, setSortBy] = useState({
        index: 0,
        direction: 'desc'
    });
    const onSort = (_, index, direction) => (
        setSortBy({
            index,
            direction
        })
    );

    return {
        sorter: (items) => {
            const column = columns[sortBy.index - columnOffset(options)];
            return column?.sortByArray ? orderByArray(
                items, column?.sortByProp, column?.sortByArray, sortBy.direction
            ) : orderArrayByProp(
                (column?.sortByProp || column?.sortByFunction), items, sortBy.direction
            );
        },
        tableProps: {
            onSort,
            sortBy,
            cells: addSortableTransform(columns)
        }
    };
};

export default useTableSort;
