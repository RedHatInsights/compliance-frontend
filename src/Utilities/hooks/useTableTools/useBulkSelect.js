import { useEffect, useState } from 'react';
import { filterSelected } from './helper';

const compileTitle = (itemsTotal, titleOption) => {
    if (typeof titleOption === 'string') {
        return titleOption;
    } else if (typeof titleOption === 'function') {
        return titleOption(itemsTotal);
    } else {
        return `${ itemsTotal } selected`;
    }
};

const checkboxState = (selectedItemsTotal, itemsTotal) => {
    if (selectedItemsTotal === 0) {
        return false;
    } else if (selectedItemsTotal === itemsTotal) {
        return true;
    } else {
        return null;
    }
};

const allItemsIncluded = (items, selection) => (
    items.filter((item) => (
        selection.includes(item)
    )).length === items.length
);

const selectOrUnselect = (selected) => (
    selected ? 'Unselect' : 'Select'
);

const checkCurrentPageSelected = (items, selectedItems) => {
    if (items.length === 0) {
        return false;
    } else {
        return allItemsIncluded(items, selectedItems);
    }
};

const itemIds = (items) => (items.map((item) => (item.itemId)));
const mergeArraysUniqly = (arrayA, arrayB) => (
    Array.from(new Set([...arrayA, ...arrayB]))
);

const useBulkSelect = ({
    onSelect,
    items: propItems,
    filter,
    paginator,
    sorter,
    preselected = [],
    setPage
} = {}) => {
    const enableBulkSelect = !!onSelect;

    const [selectedIds, setSelectedItemIds] = useState(preselected);
    const selectItemTransformer = (item) => ({
        ...item,
        rowProps: {
            selected: selectedIds.includes(item.itemId)
        }
    });

    const items = (sorter ? sorter(propItems) : propItems).map(selectItemTransformer);
    const total = items.length;

    const selectedItems = filterSelected(items, selectedIds);
    const selectedItemsTotal = selectedItems.length;
    const noneSelected = selectedItemsTotal === 0;

    const filteredItems = filter ? filter(items) : items;
    const filteredTotal = filteredItems.length;
    const filtered = filteredTotal < total;
    const allFiltertedSelected = allItemsIncluded(itemIds(filteredItems), selectedIds);

    const paginatedItems = paginator ? paginator(filteredItems) : filteredItems;
    const paginatedTotal = paginatedItems.length;

    const currentPageSelected = checkCurrentPageSelected(
        itemIds(paginatedItems), selectedIds
    );

    const title = compileTitle(selectedItemsTotal);
    const checked = checkboxState(selectedItemsTotal, total);
    const allSelected = selectedItemsTotal === total;
    const allCount = filtered ? filteredTotal : total;
    const isDisabled = allCount === 0;

    const onSelectCallback = (func) => {
        const newSelectedItems = filterSelected(items, func());
        onSelect && onSelect(newSelectedItems.map((item) => (item.itemId)));
    };

    const selectNone = () => onSelectCallback(() => {
        setSelectedItemIds([]);
        return [];
    });

    const selectOne = (_, selected, key, row) => onSelectCallback(() => {
        const newItemIds = selected ?
            [...selectedIds, row.itemId] :
            selectedIds.filter((rowId) => (rowId !== row.itemId));

        setSelectedItemIds(newItemIds);

        return newItemIds;
    });

    const selectPage = () => onSelectCallback(() => {
        const currentPageIds = itemIds(paginatedItems);
        const newItemIds = currentPageSelected ? selectedIds.filter((itemId) => (
            !currentPageIds.includes(itemId)
        )) : mergeArraysUniqly(selectedIds, currentPageIds);
        setSelectedItemIds(newItemIds);

        return newItemIds;
    });

    const selectFiltered = () => {
        const currentFilteredIds = itemIds(filteredItems);
        const newItemIds = allFiltertedSelected ? selectedIds.filter((itemId) => (
            !currentFilteredIds.includes(itemId)
        )) : mergeArraysUniqly(selectedIds, currentFilteredIds);
        setSelectedItemIds(newItemIds);

        return newItemIds;
    };

    const selectFilteredOrAll = () => (
        filtered ? selectFiltered() : setSelectedItemIds(
            itemIds(items)
        )
    );

    const selectAll = () => onSelectCallback(() => (
        allSelected ? selectNone() : selectFilteredOrAll()
    ));

    const clearSelection = () => setSelectedItemIds([]);

    useEffect(() => {
        if (paginatedTotal === 0) {
            setPage(-1);
        }
    }, [paginatedTotal]);

    return enableBulkSelect ? {
        transformer: selectItemTransformer,
        tableProps: {
            onSelect: paginatedTotal > 0 ? selectOne : undefined,
            canSelectAll: false
        },
        clearSelection,
        toolbarProps: {
            bulkSelect: {
                toggleProps: { children: [title] },
                isDisabled,
                items: [{
                    title: 'Select none',
                    onClick: selectNone,
                    props: {
                        isDisabled: noneSelected
                    }
                }, {
                    title: `${ selectOrUnselect(currentPageSelected) } page (${ paginatedTotal } items)`,
                    onClick: selectPage
                }, {
                    title: `${ selectOrUnselect(allSelected) } all (${ allCount } items)`,
                    onClick: selectAll
                }],
                checked,
                onSelect: !isDisabled ? () => selectPage() : undefined
            }
        }
    } : {};
};

export default useBulkSelect;
