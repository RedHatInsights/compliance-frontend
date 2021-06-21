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

export const stringToId = (string) => (
    string.split(' ').join('').toLowerCase()
);

export const orderArrayByProp = (property, objects, direction) => (
    objects.sort((a, b) => {
        if (direction === 'asc') {
            return String(getSortable(property, a)).localeCompare(String(getSortable(property, b)));
        } else {
            return -String(getSortable(property, a)).localeCompare(String(getSortable(property, b)));
        }
    })
);

export const orderByArray = (objectArray, orderProp, orderArray, direction) => {
    const sortedObjectArray = orderArray.flatMap((orderKey) => (
        objectArray.filter((item) => (item[orderProp] === orderKey))
    ));
    return (direction !== 'asc' ? sortedObjectArray.reverse() : sortedObjectArray);
};

export const getProperty = (obj, path, fallback) => {
    const parts = path.split('.');
    const key = parts.shift();
    if (typeof obj[key] !== 'undefined') {
        return parts.length > 0 ?
            getProperty(obj[key], parts.join('.'), fallback) :
            obj[key];
    }

    return fallback;
};

export const camelCase = (string) => (
    string.split(/[-_\W]+/g)
    .map((string) => (string.trim()))
    .map((string) => string[0].toUpperCase() + string.substring(1))
    .join('')
);
