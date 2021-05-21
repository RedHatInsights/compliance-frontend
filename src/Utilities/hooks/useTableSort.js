import { useState } from 'react';
import { orderArrayByProp } from 'Utilities/helpers';

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
