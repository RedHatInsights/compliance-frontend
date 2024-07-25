import useColumnManager from '../useColumnManager';
import useFilterConfig from '../useFilterConfig';
import usePagination from '../usePagination';
import useTableSort from '../useTableSort';
import useBulkSelect from '../useBulkSelect';

import { toToolbarActions } from './helpers';
import rowsBuilder from './rowsBuilder';

const useAsyncTableTools = (items = [], columns = [], options = {}) => {
  const {
    columnManagerAction,
    ColumnManager,
    columns: managedColumns,
  } = useColumnManager(columns, options);

  const { toolbarProps: toolbarActionsProps } = toToolbarActions({
    ...options,
    actions: [
      ...(options?.actions || []),
      ...((columnManagerAction && [columnManagerAction]) || []),
    ],
  });

  const { toolbarProps: pagintionToolbarProps, setPage } =
    usePagination(options);

  const { toolbarProps: conditionalFilterProps } = useFilterConfig({
    ...options,
    onFilterUpdate: () => setPage(1),
    onDeleteFilter: () => setPage(1),
  });

  const { tableProps: sortableTableProps } = useTableSort(managedColumns, {
    ...options,
    onSort: () => setPage(1),
  });

  const {
    transformer: selectItem,
    toolbarProps: bulkSelectToolbarProps,
    tableProps: bulkSelectTableProps,
  } = useBulkSelect({
    ...options,
    setPage,
    itemIdsOnPage: items.map(({ id }) => id),
  });

  const {
    toolbarProps: rowBuilderToolbarProps,
    tableProps: rowBuilderTableProps,
  } = rowsBuilder(items, columns, {
    emptyRows: options.emptyRows,
    transformer: [selectItem],
    // openItem from expandable hook
    // rowTransformer: [openItem],
  });

  const toolbarProps = {
    ...toolbarActionsProps,
    ...conditionalFilterProps,
    ...pagintionToolbarProps,
    ...bulkSelectToolbarProps,
    ...rowBuilderToolbarProps,
  };

  const tableProps = {
    cells: managedColumns,
    ...sortableTableProps,
    ...bulkSelectTableProps,
    ...rowBuilderTableProps,
  };
  console.log('Toolbar Props: ', toolbarProps);
  console.log('Table Props: ', tableProps);

  return {
    toolbarProps,
    tableProps,
    ColumnManager,
  };
};

export default useAsyncTableTools;
