import usePagination from '../usePagination';
import useFilterConfig from '../useFilterConfig';
import useTableSort from '../useTableSort';
import useItems from './useItems';
import rowsBuilder from './rowsBuilder';
import useBulkSelect from '../useBulkSelect';
import useExpandable from '../useExpandable';
import useColumnManager from '../useColumnManager';
import withExport from '../../utils/withExport';
import { toToolbarActions } from './helpers';

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
  const {
    columnManagerAction,
    columns: managedColumns,
    ColumnManager,
  } = useColumnManager(columns, options);

  const { toolbarProps: toolbarActionsProps } = toToolbarActions({
    ...options,
    actions: [
      ...(options?.actions || []),
      ...((columnManagerAction && [columnManagerAction]) || []),
    ],
  });

  const { toolbarProps: paginationToolbarProps, resetPage } =
    usePagination(options);

  const { toolbarProps: conditionalFilterProps } = useFilterConfig({
    ...options,
    onFilterUpdate: resetPage,
    onDeleteFilter: resetPage,
  });

  const { tableProps: sortableTableProps } = useTableSort(managedColumns, {
    ...options,
    onSort: resetPage,
  });
  const { tableProps: expandableTableProps, openItem } = useExpandable(options);

  const usableItems = useItems(items);

  const {
    toolbarProps: bulkSelectToolbarProps,
    tableProps: bulkSelectTableProps,
    markRowSelected,
  } = useBulkSelect({
    ...options,
    itemIdsOnPage: usableItems.map(({ id }) => id),
  });

  const {
    toolbarProps: rowBuilderToolbarProps,
    tableProps: rowBuilderTableProps,
  } = rowsBuilder(usableItems, managedColumns, {
    transformers: [markRowSelected, openItem],
    emptyRows: options.emptyRows,
  });

  const exportConfig = withExport({
    columns,
    ...options,
  });

  const toolbarProps = {
    ...toolbarActionsProps,
    ...paginationToolbarProps,
    ...conditionalFilterProps,
    ...rowBuilderToolbarProps,
    ...bulkSelectToolbarProps,
    ...exportConfig.toolbarProps,
    ...toolbarPropsOption,
  };

  const tableProps = {
    // TODO we should have a hook that maintains columns.
    // at least the columns manager and table sort hook "act" on columns, currently without a good interface
    cells: managedColumns,
    ...sortableTableProps,
    ...rowBuilderTableProps,
    ...bulkSelectTableProps,
    ...tablePropsOption,
    ...expandableTableProps,
  };

  // TODO only for development purposes remove before switching to async tables by default
  console.log('Toolbar Props: ', toolbarProps);
  console.log('Table Props: ', tableProps);

  return {
    toolbarProps,
    tableProps,
    ColumnManager,
  };
};

export default useAsyncTableTools;
