import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import { entitiesReducer } from 'Store/Reducers/SystemStore';

const INVENTORY_GROUPS_AND_TAGS_KEYS = new Set(['groups', 'tags']);

export const filterColumnsByInventoryFeatures = (
  columns = [],
  inventoryGroupsAndTags = true,
) => {
  if (inventoryGroupsAndTags) {
    return columns;
  }

  return columns.filter((column) => {
    const key = typeof column === 'string' ? column : column?.key;
    return !INVENTORY_GROUPS_AND_TAGS_KEYS.has(key);
  });
};

export const mergedColumns = (columns) => (defaultColumns) =>
  columns.reduce((prev, column) => {
    const isStringCol = typeof column === 'string';
    const key = isStringCol ? column : column.key;
    const defaultColumn = defaultColumns.find(
      (defaultCol) => defaultCol.key === key,
    );

    if (defaultColumn === undefined && column?.requiresDefault === true) {
      return prev; // exclude if not found in inventory
    } else {
      return [
        ...prev,
        {
          ...defaultColumn,
          ...(isStringCol ? { key: column } : column),
          props: {
            ...defaultColumn?.props,
            ...column?.props,
          },
        },
      ];
    }
  }, []);

export const defaultOnLoad =
  (columns) =>
  ({ INVENTORY_ACTION_TYPES, mergeWithEntities }) =>
    getRegistry().register({
      ...mergeWithEntities(entitiesReducer(INVENTORY_ACTION_TYPES, columns)),
    });
