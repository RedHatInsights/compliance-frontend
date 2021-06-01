import React from 'react';

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

export const renderComponent = (Component, props) => (
    (_data, _id, entity) => ( // eslint-disable-line react/display-name
        <Component { ...entity } { ...props } />
    )
);

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
