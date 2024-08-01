import { emptyRows } from 'Utilities/hooks/useTableTools/Components/NoResultsTable';

const columnProp = (column) =>
  column.key || column.original?.toLowerCase() || column.title?.toLowerCase();

const itemRow = (item, columns) => ({
  ...item.rowProps,
  itemId: item.itemId || item.id,
  cells: columns.map((column) => ({
    title: column.renderFunc
      ? column.renderFunc(undefined, undefined, item)
      : item[columnProp(column)],
  })),
});

/**
 *  A function to compile a list of items and passed columns into rows for the Patternfly (v4) Table component within a `tableProps` object.
 *
 *  @param {Array} items An array of items to render
 *  @param {Array} columns An array of columns to render the rows with
 *  @param {object} [options] Options for rendering rows
 *  @param {object} [options.emptyRows] A component to render when no items are to render. (`.length === 0`)
 *
 *  @returns {object} A object containing `tableProps`
 *
 *  @category AsyncTableTools
 *  @subcategory internal
 *
 */
const rowsBuilder = (items, columns, options = {}) => {
  // TODO when introducing the `useBulkSelect` or `useExpandable` this will need to be extend again to support "transformers"
  const EmptyRowsComponent =
    options.emptyRows || emptyRows(undefined, columns.length);

  const rows =
    items &&
    (items.length > 0
      ? items.flatMap((item) => itemRow(item, columns)).filter((v) => !!v)
      : EmptyRowsComponent);

  return {
    tableProps: {
      ...(rows ? { rows } : {}),
    },
  };
};

export default rowsBuilder;
