import usePagination from '../usePagination';
import rowsBuilder from './rowsBuilder';

/**
 * Provides an interface for hooks to store their states namespaced into the tableState in the TableContext
 *
 * @param {Object} namespace A key to namespace the state under (e.g. 'filters', 'sort')
 * @param {Object} [initialState] Initial state to put into the table state
 * @param {Object} [options] Options for the state
 *
 * **Options:**
 *  * **serialiser** a function to serialise the table state and allow access it via the useSerialisedTableState hook
 *
 */
const useAsyncTableTools = (items = [], columns = [], options = {}) => {
  // TODO only for development purposes remove before switching to async tables by default
  console.log('Async Table params:', items, columns, options);
  const { toolbarProps: toolbarPropsOption, tableProps: tablePropsOption } =
    options;

  const { toolbarProps: pagintionToolbarProps } = usePagination(options);

  const {
    toolbarProps: rowBuilderToolbarProps,
    tableProps: rowBuilderTableProps,
  } = rowsBuilder(items, columns, {
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
