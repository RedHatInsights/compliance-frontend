import useFilterConfig from './useFilterConfig';
import useTableSort from './useTableSort';
import usePaginate from './usePaginate';
import useRowsBuilder from './useRowsBuilder';
import useBulkSelect from './useBulkSelect';
import useItemIdentify from './useItemIdentify';
import useConditionalTableHook from './useConditionalTableHook';
import useExpandable from './useExpandable';
import useDedicatedAction from './useDedicatedAction';

const useTableTools = (items = [], columns = [], options = {}) => {
    const {
        toolbarProps: toolbarPropsOption, tableProps: tablePropsOption
    } = options;
    const enableFilters = !!options.filters;
    const enableBulkSelect = !!options.onSelect;
    const enablePagination = options?.pagination !== false;
    const enableExpanbale = !!options.detailsComponent;
    const enableDedicatedAction = !!options.dedicatedAction;

    const identifiedItems = useItemIdentify(items, options);

    const {
        tableProps: sortableTableProps, sorter
    } = useTableSort(columns, options);

    const {
        toolbarProps: pagintionToolbarProps, setPage, paginator
    } = useConditionalTableHook(enablePagination, usePaginate, options);

    const {
        toolbarProps: conditionalFilterProps,
        filter,
        selectedFilterToolbarProps
    } = useConditionalTableHook(enableFilters, useFilterConfig, {
        ...options,
        setPage
    });

    const {
        transformer: openItem, tableProps: expandableProps
    } = useConditionalTableHook(enableExpanbale, useExpandable, options);

    const {
        transformer: selectItem,
        toolbarProps: bulkSelectToolbarProps,
        tableProps: bulkSelectTableProps,
        selected
    } = useConditionalTableHook(enableBulkSelect, useBulkSelect, {
        ...options,
        items: identifiedItems,
        filter,
        paginator,
        sorter,
        setPage
    });

    const {
        toolbarProps: dedicatedActionToolbarProps
    } = useConditionalTableHook(enableDedicatedAction, useDedicatedAction, {
        ...options,
        additionalDedicatedActions: [
            selectedFilterToolbarProps?.dedicatedAction
        ],
        selected
    });

    const {
        toolbarProps: rowBuilderToolbarProps, tableProps: rowBuilderTableProps
    } = useRowsBuilder(identifiedItems, sortableTableProps.cells, {
        emptyRows: options.emptyRows,
        transformer: [selectItem],
        rowTransformer: [openItem],
        pagination: pagintionToolbarProps?.pagination,
        paginator,
        filter,
        sorter
    });

    const toolbarProps = {
        ...pagintionToolbarProps,
        ...bulkSelectToolbarProps,
        ...conditionalFilterProps,
        ...selectedFilterToolbarProps,
        ...dedicatedActionToolbarProps,
        ...rowBuilderToolbarProps,
        ...toolbarPropsOption
    };

    const tableProps = {
        cells: columns,
        ...rowBuilderTableProps,
        ...sortableTableProps,
        ...bulkSelectTableProps,
        ...expandableProps,
        ...tablePropsOption
    };

    return {
        toolbarProps,
        tableProps
    };
};

export default useTableTools;
