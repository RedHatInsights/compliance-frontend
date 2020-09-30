import { useState } from 'react';

const getSortable = (property, item) => {
    if (typeof(property) === 'function') {
        return property(item);
    } else {
        return item[property];
    }
};

export const orderArrayByProp = (property, objects, direction) => (
    objects.sort((a, b) => {
        if (direction === 'asc') {
            return String(getSortable(property, a)).localeCompare(String(getSortable(property, b)));
        } else {
            return -String(getSortable(property, a)).localeCompare(String(getSortable(property, b)));
        }
    })
);

export const orderByArray = (objectArray, orderProp, orderArray, direction) => (
    (direction !== 'asc' ? orderArray.reverse() : orderArray).flatMap((orderKey) => (
        objectArray.filter((item) => (item[orderProp] === orderKey))
    ))
);

const useTableSort = (array, columns) => {
    const [sortBy, setSortBy] = useState({
        index: 0,
        direction: 'desc'
    });
    const column = columns[sortBy.index];
    const onSort = (_, index, direction) => (
        setSortBy({
            index,
            direction
        })
    );

    return {
        tableSort: {
            onSort,
            sortBy
        },
        sorted: orderArrayByProp(
            (column?.sortByProperty || column?.sortByFunction), array, sortBy.direction
        )
    };
};

export default useTableSort;
