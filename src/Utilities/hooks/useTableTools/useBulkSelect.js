import { useEffect, useState } from 'react';
import { filterSelected } from './helper';

const compileTitle = (itemsTotal, titleOption) => {
  if (typeof titleOption === 'string') {
    return titleOption;
  } else if (typeof titleOption === 'function') {
    return titleOption(itemsTotal);
  } else {
    return `${itemsTotal} selected`;
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

const allItemsIncluded = (items, selection = []) =>
  items.filter((item) => selection.includes(item)).length === items.length;

const selectOrUnselect = (selected) => (selected ? 'Unselect' : 'Select');

const checkCurrentPageSelected = (items, selectedItems) => {
  if (selectedItems.length === 0) {
    return false;
  } else {
    return allItemsIncluded(items, selectedItems);
  }
};

const itemIds = (items) => items.map((item) => item.itemId);
const mergeArraysUniqly = (arrayA, arrayB) =>
  Array.from(new Set([...arrayA, ...arrayB]));

export const useBulkSelect = ({
  total,
  onSelect,
  preselected,
  itemIdsInTable,
  itemIdsOnPage,
  identifier = 'id',
  showTreeTable,
}) => {
  const enableBulkSelect = !!onSelect;
  const [selectedIds, setSelectedItemIds] = useState(preselected);
  const selectedIdsTotal = (selectedIds || []).length;
  const paginatedTotal = itemIdsOnPage().length;
  const allSelected = selectedIdsTotal === total;
  const noneSelected = selectedIdsTotal === 0;
  const currentPageSelected = checkCurrentPageSelected(
    itemIdsOnPage(),
    selectedIds || []
  );

  const isDisabled = total === 0;
  const checked = checkboxState(selectedIdsTotal, total);
  const title = compileTitle(selectedIdsTotal);

  const onSelectCallback = async (func) => {
    const newSelectedItemsIds = await func();
    setSelectedItemIds(newSelectedItemsIds);
    onSelect && onSelect(newSelectedItemsIds);
  };

  const selectItems = (itemIds) => mergeArraysUniqly(selectedIds, itemIds);

  const unselectItems = (itemIds) =>
    selectedIds.filter((itemId) => !itemIds.includes(itemId));

  const unselectAll = () => [];
  const selectNone = () => onSelectCallback(unselectAll);
  const selectOne = (_, selected, key, row) => {
    onSelectCallback(() =>
      selected
        ? selectItems([row[identifier]])
        : unselectItems([row[identifier]])
    );
  };

  const selectPage = () =>
    onSelectCallback(() => {
      const currentPageIds = itemIdsOnPage();
      const currentPageSelected =
        mergeArraysUniqly(selectedIds, currentPageIds).length ===
        selectedIds.length;

      return currentPageSelected
        ? unselectItems(currentPageIds)
        : selectItems(currentPageIds);
    });

  const selectAll = () =>
    onSelectCallback(async () =>
      allSelected ? unselectAll() : selectItems(await itemIdsInTable())
    );

  useEffect(() => {
    setSelectedItemIds(preselected);
  }, [preselected]);

  return enableBulkSelect
    ? {
        selectedIds,
        selectNone,
        selectItems: (ids) => onSelectCallback(() => selectItems(ids)),
        unselectItems: (ids) => onSelectCallback(() => unselectItems(ids)),
        tableProps: {
          ...(!showTreeTable
            ? { onSelect: total > 0 ? selectOne : undefined }
            : {}),
          canSelectAll: false,
        },
        toolbarProps: {
          bulkSelect: {
            toggleProps: { children: [title], count: total },
            isDisabled,
            items: [
              {
                title: 'Select none',
                onClick: selectNone,
                props: {
                  isDisabled: noneSelected,
                },
              },
              {
                title: `${selectOrUnselect(
                  currentPageSelected
                )} page (${paginatedTotal} items)`,
                onClick: selectPage,
              },
              {
                title: `${selectOrUnselect(allSelected)} all (${total} items)`,
                onClick: selectAll,
              },
            ],
            checked,
            onSelect: !isDisabled ? selectPage : undefined,
          },
        },
      }
    : {};
};

const selectItemTransformer = (item, selectedIds) => ({
  ...item,
  rowProps: {
    selected: (selectedIds || []).includes(item.itemId),
  },
});

export const useBulkSelectWithItems = ({
  onSelect,
  items: propItems,
  filter,
  paginator,
  preselected,
  setPage,
  ...options
}) => {
  const enableBulkSelect = !!onSelect;
  const items = propItems.map((item) =>
    selectItemTransformer(item, preselected)
  );
  const total = items.length;

  const filteredItems = filter ? filter(items) : items;
  const filteredTotal = filteredItems.length;
  const filtered = filteredTotal !== total;

  const paginatedItems = paginator ? paginator(filteredItems) : filteredItems;
  const paginatedTotal = paginatedItems.length;

  const allCount = filtered ? filteredTotal : total;

  useEffect(() => {
    if (paginatedTotal === 0 && setPage) {
      setPage?.(-1);
    }
  }, [paginatedTotal]);

  const { selectNone, selectedIds, ...bulkSelect } = useBulkSelect({
    ...options,
    total: allCount,
    onSelect,
    preselected,
    itemIdsInTable: () => (filtered ? itemIds(filteredItems) : itemIds(items)),
    itemIdsOnPage: () => itemIds(paginatedItems),
    identifier: 'itemId',
  });

  return enableBulkSelect
    ? {
        transformer: (item) => selectItemTransformer(item, selectedIds),
        selectedItems: filterSelected(items, selectedIds),
        selected: selectedIds,
        clearSelection: selectNone,
        ...bulkSelect,
      }
    : {};
};
