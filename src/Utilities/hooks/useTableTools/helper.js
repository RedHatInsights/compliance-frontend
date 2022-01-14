import { uniq } from '@/Utilities/helpers';

export const filterSelected = (items, selectedIds = []) =>
  items.filter((item) => selectedIds.includes(item.itemId));

export const filteredAndSortedItems = (items, filter, sorter) => {
  const filtered = filter ? filter(items) : items;
  return sorter ? sorter(filtered) : filtered;
};

const mergeIfArray = (firstValue, secondValue) => {
  if (firstValue?.constructor.toString().indexOf('Array') > -1) {
    return uniq([...firstValue, ...(secondValue || [])]);
  } else {
    return secondValue;
  }
};

export const mergeFilters = (currentFilters, additionalFilters) =>
  Object.keys(currentFilters).reduce((acc, filter) => {
    acc[filter] = mergeIfArray(
      currentFilters[filter],
      additionalFilters[filter]
    );
    return acc;
  }, {});
