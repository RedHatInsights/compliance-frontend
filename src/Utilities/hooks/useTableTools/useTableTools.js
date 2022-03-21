import useFilterConfig from './useFilterConfig';
import { useTableSortWithItems } from './useTableSort';
import usePaginate from './usePaginate';
import useRowsBuilder from './useRowsBuilder';
import { useBulkSelectWithItems } from './useBulkSelect';
import useItemIdentify from './useItemIdentify';
import useExpandable from './useExpandable';
import useDedicatedAction from './useDedicatedAction';
import useToolbarActions from './useToolbarActions';
import useColumnManager from './useColumnManager';
import { useRadioSelectWithItems } from './useRadioSelect';
import { useExportWithItems } from './useExport';

const filteredAndSortedItems = (items, filter, sorter) => {
  const filtered = filter ? filter(items) : items;
  return sorter ? sorter(filtered) : filtered;
};

const useTableTools = (items = [], columns = [], options = {}) => {
  const { toolbarProps: toolbarPropsOption, tableProps: tablePropsOption } =
    options;

  const identifiedItems = useItemIdentify(items, options);

  const {
    columnManagerAction,
    ColumnManager,
    columns: managedColumns,
  } = useColumnManager(columns, options);

  const { toolbarProps: toolbarActionsProps } = useToolbarActions({
    ...options,
    actions: [
      ...(options?.actions || []),
      ...((columnManagerAction && [columnManagerAction]) || []),
    ],
  });

  const {
    toolbarProps: pagintionToolbarProps,
    setPage,
    paginator,
  } = usePaginate(options);

  const {
    toolbarProps: conditionalFilterProps,
    filter,
    selectedFilterToolbarProps,
  } = useFilterConfig({
    ...options,
    setPage,
  });

  const { transformer: openItem, tableProps: expandableProps } =
    useExpandable(options);

  const { tableProps: sortableTableProps, sorter } = useTableSortWithItems(
    items,
    managedColumns,
    options
  );

  const {
    transformer: selectItem,
    toolbarProps: bulkSelectToolbarProps,
    tableProps: bulkSelectTableProps,
    selectedItems,
  } = useBulkSelectWithItems({
    ...options,
    items: sorter(identifiedItems),
    filter,
    paginator,
    setPage,
  });

  const { tableProps: radioSelectTableProps } = useRadioSelectWithItems({
    items: filteredAndSortedItems(identifiedItems, filter, sorter),
    ...options,
  });

  const { toolbarProps: dedicatedActionToolbarProps } = useDedicatedAction({
    ...options,
    selected: selectedItems,
    additionalDedicatedActions: selectedFilterToolbarProps?.dedicatedAction,
  });

  const { toolbarProps: exportToolbarProps } = useExportWithItems(
    filteredAndSortedItems(
      selectedItems?.length > 0 ? selectedItems : items,
      filter,
      sorter
    ),
    managedColumns,
    options
  );

  const {
    toolbarProps: rowBuilderToolbarProps,
    tableProps: rowBuilderTableProps,
  } = useRowsBuilder(identifiedItems, sortableTableProps.cells, {
    emptyRows: options.emptyRows,
    transformer: [selectItem],
    rowTransformer: [openItem],
    pagination: pagintionToolbarProps?.pagination,
    paginator,
    filter,
    sorter,
  });

  const toolbarProps = {
    ...pagintionToolbarProps,
    ...bulkSelectToolbarProps,
    ...conditionalFilterProps,
    ...selectedFilterToolbarProps,
    ...dedicatedActionToolbarProps,
    ...rowBuilderToolbarProps,
    ...toolbarPropsOption,
    ...exportToolbarProps,
    ...toolbarActionsProps,
  };

  const tableProps = {
    cells: managedColumns,
    ...rowBuilderTableProps,
    ...sortableTableProps,
    ...bulkSelectTableProps,
    ...expandableProps,
    ...radioSelectTableProps,
    ...tablePropsOption,
  };

  return {
    toolbarProps,
    tableProps,
    ColumnManager,
  };
};

export default useTableTools;
