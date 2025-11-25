import React from 'react';
import natsort from 'natsort';

export const uniq = (collection) => [...new Set(collection)];

export const sortingByProp =
  (propName, order = 'asc') =>
  (objA, objB) => {
    const descending = order != 'asc';
    const propA = (objA && objA[propName]) || '';
    const propB = (objB && objB[propName]) || '';

    const sorter = natsort({ desc: descending });
    return sorter(propA, propB);
  };

// eslint-disable-next-line react/display-name
export const renderComponent = (Component, props) => (_data, _id, entity) => (
  <Component {...entity} {...props} />
);

export const stringToId = (string) => string.split(' ').join('-').toLowerCase();

export const buildOSObject = (osVersions = []) => {
  return osVersions
    .filter((version) => !!version && typeof version === 'string')
    .map((version) => {
      const [major, minor] = version.split('.');
      return {
        count: 0,
        value: {
          name: 'RHEL',
          major,
          minor,
        },
      };
    });
};

export const capitalizeWord = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const stringToSentenceCase = (string) => {
  const lowercasedString = string.toLowerCase();
  return lowercasedString.charAt(0).toUpperCase() + lowercasedString.slice(1);
};

export const isObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const resetRuleValueOverrides = (
  valueOverrides,
  osMinorVersion,
  ruleValues,
) => {
  const valueOverridesUpdated = structuredClone(valueOverrides);

  Object.keys(ruleValues).forEach((ruleId) => {
    if (valueOverridesUpdated?.[osMinorVersion]?.[ruleId] !== undefined) {
      delete valueOverridesUpdated[osMinorVersion][ruleId];
    }
  });

  if (
    valueOverridesUpdated?.[osMinorVersion] &&
    Object.keys(valueOverridesUpdated[osMinorVersion]).length === 0
  ) {
    delete valueOverridesUpdated[osMinorVersion];
  }

  return valueOverridesUpdated;
};
