import { sortable } from '@patternfly/react-table';
import uniq from 'lodash/uniq';

const isSortable = (column) => !!column.sortable;

export const addSortableTransform = (columns) =>
  columns.map((column) => ({
    ...column,
    ...(isSortable(column)
      ? {
          transforms: uniq([...(column?.transforms || []), sortable]),
        }
      : {}),
  }));

// The sort click event passes an index including the select and/or the expand column
// Therefore we need to add an offset in these cases to match with the index of the columns passed in
export const columnOffset = (options = {}) => {
  const init =
    (typeof options.onSelect === 'function') +
    (typeof options.detailsComponent !== 'undefined');
  return typeof options.tableTree !== 'undefined' ? init - 1 : init;
};
