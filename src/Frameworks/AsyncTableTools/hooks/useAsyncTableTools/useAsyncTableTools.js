import usePagination from '../usePagination';
import useItems from './useItems';
import rowsBuilder from './rowsBuilder';

/**
 * This hook combines several "Table hooks" and returns props for Patternfly (v4) Table components and the FEC PrimaryToolbar
 *
 * @param {Array | function} items An array or (async) function that returns an array of items to render or an async function to call with the tableState and serialised table state
 * @param {Object} columns An array of columns to render the items/rows with
 * @param {Object} [options] Options for the useAsyncTableTools hook
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
