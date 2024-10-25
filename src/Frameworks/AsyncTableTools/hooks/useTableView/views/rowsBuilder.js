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

const applyTransformations = (row, transformers, selectedIds, index) => {
  return transformers.reduce(
    (currentRow, transformer) =>
      transformer ? transformer(currentRow, selectedIds, index) : currentRow,
    row
  );
};

/**
 * A function to compile a list of items and passed columns into rows for the Patternfly (v4) Table component within a `tableProps` object.
 *
 *  @param   {Array}  items               An array of items to render
 *  @param   {Array}  columns             An array of columns to render the rows with
 *  @param   {object} [options]           Options for rendering rows
 *  @param   {object} [options.emptyRows] A component to render when no items are to render. (`.length === 0`)
 *
 *  @returns {object}                     A object containing `tableProps`
 *
 *  @category AsyncTableTools
 *  @subcategory internal
 *
 */
const rowsBuilder = (items, columns, options = {}) => {
  const { transformers = [], selectedIds = [] } = options;
  const EmptyRowsComponent =
    options.emptyRows || emptyRows(undefined, columns.length);
  let runningIndex = 0;

  return (
    items &&
    (items.length > 0
      ? items
          .flatMap((item) => {
            const row = itemRow(item, columns);

            const transformedRow = applyTransformations(
              row,
              transformers,
              selectedIds,
              runningIndex,
              item
            );
            runningIndex = runningIndex + (transformedRow?.length || 0);
            return transformedRow;
          })
          .filter((v) => !!v)
      : EmptyRowsComponent)
  );
};

export default rowsBuilder;
