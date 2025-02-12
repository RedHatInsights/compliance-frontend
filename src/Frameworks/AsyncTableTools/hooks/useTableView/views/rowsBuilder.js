import { emptyRows } from 'Utilities/hooks/useTableTools/Components/NoResultsTable';
import { buildRows } from './helpers';

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
  const {
    expandable: { enableExpandingRow, expandRow } = {},
    bulkSelect: { enableBulkSelect, markRowSelected } = {},
  } = options;

  const EmptyRowsComponent =
    options.emptyRows || emptyRows(undefined, columns.length);
  const rowTransformers = [
    ...(enableBulkSelect ? [markRowSelected] : []),
    ...(enableExpandingRow ? [expandRow] : []),
  ];

  return (
    items &&
    (items.length > 0
      ? buildRows(items, columns, rowTransformers)
      : EmptyRowsComponent)
  );
};

export default rowsBuilder;
