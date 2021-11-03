export const filterSelected = (items, selectedIds = []) =>
  items.filter((item) => selectedIds.includes(item.itemId));

export const filteredAndSortedItems = (items, filter, sorter) => {
  const filtered = filter ? filter(items) : items;
  return sorter ? sorter(filtered) : filtered;
};
