import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import { entitiesReducer } from 'Store/Reducers/SystemStore';
import withExport from '@/Frameworks/AsyncTableTools/utils/withExport';
import { dispatchNotification } from 'Utilities/Dispatcher';

export const mergedColumns = (columns) => (defaultColumns) =>
  columns.reduce((prev, column) => {
    const isStringCol = typeof column === 'string';
    const key = isStringCol ? column : column.key;
    const defaultColumn = defaultColumns.find(
      (defaultCol) => defaultCol.key === key
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

export const withSystemsExport = ({ columns, exporter, total }) => {
  const onStart = () =>
    dispatchNotification({
      variant: 'info',
      title: 'Preparing export',
      description: 'Once complete, your download will start automatically.',
    });

  const onComplete = () =>
    dispatchNotification({
      variant: 'success',
      title: 'Downloading export',
    });

  const onError = () =>
    dispatchNotification({
      variant: 'danger',
      title: 'Couldn’t download export',
      description: 'Reinitiate this export to try again.',
    });

  const {
    toolbarProps: { exportConfig },
  } = withExport({
    exporter,
    columns,
    isDisabled: total === 0,
    onStart,
    onComplete,
    onError,
  });

  return exportConfig;
};
