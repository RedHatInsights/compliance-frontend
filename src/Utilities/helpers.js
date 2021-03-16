export const uniq = (collection) => [...new Set(collection)];

export const sortingByProp = (propName, order = 'asc') => (
    (objA, objB) => {
        const propA = (objA && objA[propName]) || '';
        const propB = (objB && objB[propName]) || '';
        if (propA === propB) {
            return 0;
        } else if (order === 'asc') {
            return propA < propB ? -1 : 1;
        } else {
            return propA < propB ? 1 : -1;
        }
    }
);
