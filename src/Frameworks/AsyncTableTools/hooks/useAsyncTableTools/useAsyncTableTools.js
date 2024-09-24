import { useMemo } from 'react';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';

import usePagination from '../usePagination';
import useFilterConfig from '../useFilterConfig';
import useTableSort from '../useTableSort';
import useItems from '../useItems';
import rowsBuilder from './rowsBuilder';
import useBulkSelect from '../useBulkSelect';
import useExpandable from '../useExpandable';
import useColumnManager from '../useColumnManager';
import withExport from '../../utils/withExport';
import { toToolbarActions } from './helpers';

/**
 *  @typedef {object} useAsyncTableToolsReturn
 *
 *  @property {object} toolbarProps Object containing PrimaryToolbar props
 *  @property {object} tableProps   Object containing Patternfly (deprecated) Table props
 */

/**
 * This hook combines several "Table hooks" and returns props for Patternfly (v4) Table components and the FEC PrimaryToolbar
 *
 *  @param   {Array | Function}         items     An array or (async) function that returns an array of items to render or an async function to call with the tableState and serialised table state
 *  @param   {object}                   columns   An array of columns to render the items/rows with
 *  @param   {object}                   [options] AsyncTableTools options
 *
 *  @returns {useAsyncTableToolsReturn}           An object of props meant to be used in the {@link AsyncTableToolsTable}
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useAsyncTableTools = (items, columns, options = {}) => {
  const { toolbarProps: toolbarPropsOption, tableProps: tablePropsOption } =
    options;
  const { items: usableItems } = useItems(items);

  const {
    columnManagerAction,
    columns: managedColumns,
    ColumnManager,
  } = useColumnManager(columns, options);

  const { toolbarProps: toolbarActionsProps } = useMemo(
    () =>
      toToolbarActions({
        ...options,
        actions: [
          ...(options?.actions || []),
          ...((columnManagerAction && [columnManagerAction]) || []),
        ],
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(columnManagerAction), JSON.stringify(options)]
  );

  const { toolbarProps: paginationToolbarProps } = usePagination(options);

  const { toolbarProps: conditionalFilterProps } = useFilterConfig(options);

  const { tableProps: sortableTableProps } = useTableSort(
    managedColumns,
    options
  );
  const { tableProps: expandableTableProps, openItem } = useExpandable(options);

  const {
    toolbarProps: bulkSelectToolbarProps,
    tableProps: bulkSelectTableProps,
    markRowSelected,
  } = useBulkSelect({
    ...options,
    itemIdsOnPage: usableItems?.map(({ id }) => id),
  });

  const { tableProps: rowBuilderTableProps } = useMemo(
    () =>
      rowsBuilder(usableItems, managedColumns, {
        transformers: [markRowSelected, openItem],
        emptyRows: options.emptyRows,
      }),
    [usableItems, managedColumns, markRowSelected, openItem, options.emptyRows]
  );

  const exportConfig = withExport({
    managedColumns,
    ...options,
  });

  const toolbarProps = useMemo(
    () => ({
      ...toolbarActionsProps,
      ...paginationToolbarProps,
      ...conditionalFilterProps,
      ...bulkSelectToolbarProps,
      ...exportConfig.toolbarProps,
      ...toolbarPropsOption,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      toolbarActionsProps,
      paginationToolbarProps,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(conditionalFilterProps),
      bulkSelectToolbarProps,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(exportConfig.toolbarProps),
      toolbarPropsOption,
    ]
  );

  const tableProps = useMemo(
    () => ({
      // TODO we should have a hook that maintains columns.
      // at least the columns manager and table sort hook "act" on columns, currently without a good interface
      cells: managedColumns,
      ...sortableTableProps,
      ...bulkSelectTableProps,
      ...tablePropsOption,
      ...expandableTableProps,
      ...rowBuilderTableProps,
    }),
    [
      managedColumns,
      sortableTableProps,
      bulkSelectTableProps,
      tablePropsOption,
      expandableTableProps,
      rowBuilderTableProps,
    ]
  );

  useDeepCompareEffectNoCheck(() => {
    // TODO only for development purposes remove before switching to async tables by default
    console.log('Async Table params:', items, columns, options);
    console.log('Toolbar Props: ', toolbarProps);
    console.log('Table Props: ', tableProps);
  }, [toolbarProps, tableProps]);

  return {
    toolbarProps,
    tableProps,
    ColumnManager,
  };
};

export default useAsyncTableTools;
