import useFilterConfig from './useFilterConfig';
import useTableSort from './useTableSort';
import usePaginate from './usePaginate';
import useRowsBuilder from './useRowsBuilder';
import { useBulkSelectWithItems } from './useBulkSelect';
import useItemIdentify from './useItemIdentify';
import useExpandable from './useExpandable';
import useDedicatedAction from './useDedicatedAction';

const useTableTools = (items = [], columns = [], options = {}) => {
  const { toolbarProps: toolbarPropsOption, tableProps: tablePropsOption } =
    options;

  const identifiedItems = useItemIdentify(items, options);

  const { tableProps: sortableTableProps, sorter } = useTableSort(
    columns,
    options
  );

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

  const { toolbarProps: dedicatedActionToolbarProps } = useDedicatedAction({
    ...options,
    selected: selectedItems,
    additionalDedicatedActions: selectedFilterToolbarProps?.dedicatedAction,
  });

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
  };

  const tableProps = {
    cells: columns,
    ...rowBuilderTableProps,
    ...sortableTableProps,
    ...bulkSelectTableProps,
    ...expandableProps,
    ...tablePropsOption,
  };

  return {
    toolbarProps,
    tableProps,
  };
};

export default useTableTools;
