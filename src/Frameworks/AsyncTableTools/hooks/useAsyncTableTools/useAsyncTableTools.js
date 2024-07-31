import usePagination from '../usePagination';
import useItems from './useItems';
import rowsBuilder from './rowsBuilder';

/**
 *  @typedef {object} AsyncTableProps
 *  @property {object} toolbarProps Object containing PrimaryToolbar props
 *  @property {object} tableProps Object containing Patternfly (deprecated) Table props
 */

/**
 *  This hook combines several "Table hooks" and returns props for Patternfly (v4) Table components and the FEC PrimaryToolbar
 *
 *  @param {Array | Function} items An array or (async) function that returns an array of items to render or an async function to call with the tableState and serialised table state
 *  @param {object} columns An array of columns to render the items/rows with
 *  @param {object} [options] Options for the useAsyncTableTools hook
 *
 *  @returns {AsyncTableProps} An object of props meant to be used in the {@link AsyncTableToolsTable}
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useAsyncTableTools = (items, columns, options = {}) => {
  // TODO only for development purposes remove before switching to async tables by default
  console.log('Async Table params:', items, columns, options);
  const { toolbarProps: toolbarPropsOption, tableProps: tablePropsOption } =
    options;
  const { toolbarProps: pagintionToolbarProps } = usePagination(options);

  const usableItems = useItems(items);
  const {
    toolbarProps: rowBuilderToolbarProps,
    tableProps: rowBuilderTableProps,
  } = rowsBuilder(usableItems, columns, {
    emptyRows: options.emptyRows,
  });

  const toolbarProps = {
    ...pagintionToolbarProps,
    ...rowBuilderToolbarProps,
    ...toolbarPropsOption,
  };

  const tableProps = {
    cells: columns,
    ...rowBuilderTableProps,
    ...tablePropsOption,
  };

  // TODO only for development purposes remove before switching to async tables by default
  console.log('Toolbar Props: ', toolbarProps);
  console.log('Table Props: ', tableProps);

  return {
    toolbarProps,
    tableProps,
  };
};

export default useAsyncTableTools;
