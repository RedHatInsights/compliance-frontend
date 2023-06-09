import { useState, useEffect, useMemo } from 'react';
import FilterConfigBuilder from './FilterConfigBuilder/FilterConfigBuilder';
import useSelectedFilter from './useSelectedFilter';

const filterValues = (activeFilters) =>
  Object.values(activeFilters).filter((value) => {
    if (typeof value === Object) {
      return Object.values(value).length > 0;
    }

    if (typeof value === Array) {
      return value.length > 0;
    }

    return !!value;
  });

const filterConfigBuilder = new FilterConfigBuilder([]);

const perpareInitialActiveFilters = (
  initialActiveFiltersRaw,
  activeFilters
) => {
  if (typeof initialActiveFiltersRaw === 'function') {
    return initialActiveFiltersRaw(activeFilters);
  } else {
    return initialActiveFiltersRaw;
  }
};

const useFilterConfig = (options = {}) => {
  const { filters, setPage, selectedFilter, onDeleteFilter, onFilter } =
    options;
  const enableFilters = !!filters;
  const { filterConfig = [], activeFilters: initialActiveFiltersRaw } =
    filters || {};

  const [activeFilters, setActiveFilters] = useState({});
  const initialActiveFilters = perpareInitialActiveFilters(
    initialActiveFiltersRaw,
    activeFilters
  );
  const onFilterUpdate = (filter, value) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: value,
    }));
    if (filter === 'name') {
      onFilter?.();
    }
    setPage && setPage(1);
  };

  const addConfigItem = (item) => {
    filterConfigBuilder.addConfigItem(item);
    setActiveFilters(filterConfigBuilder.initialDefaultState(activeFilters));
  };

  const clearAllFilter = () =>
    setActiveFilters(filterConfigBuilder.initialDefaultState());

  const deleteFilter = (chips) =>
    setActiveFilters(
      filterConfigBuilder.removeFilterWithChip(chips, activeFilters)
    );
  const onFilterDelete = async (_event, chips, clearAll = false) => {
    (await clearAll) ? clearAllFilter() : deleteFilter(chips[0]);
    onDeleteFilter && onDeleteFilter(chips, clearAll);
  };

  const filter = (items) =>
    filterConfigBuilder.applyFilterToObjectArray(items, activeFilters);

  const {
    toolbarProps: selectedFilterToolbarProps,
    filterItem: selectFilterItem,
  } = useSelectedFilter({
    activeFilters,
    setActiveFilter: onFilterUpdate,
    selectedFilter,
  });

  const activeFilterValues = useMemo(
    () => filterValues(activeFilters),
    [activeFilters]
  );

  const filterConfigWithSelected = [
    ...filterConfig,
    ...(selectFilterItem ? [selectFilterItem] : []),
  ];

  useEffect(() => {
    filterConfigBuilder.config = [];
    filterConfigWithSelected.filter((v) => !!v).forEach(addConfigItem);
    setActiveFilters(
      filterConfigBuilder.initialDefaultState(initialActiveFilters || []),
      filterConfig
    );

    return () => {
      filterConfigBuilder.config = [];
    };
  }, [JSON.stringify(initialActiveFilters)]);

  return enableFilters
    ? {
        filter,
        selectedFilterToolbarProps,
        toolbarProps: {
          filterConfig: filterConfigBuilder.buildConfiguration(
            onFilterUpdate,
            activeFilters,
            {},
            filterConfigWithSelected
          ),
          activeFiltersConfig: {
            filters: filterConfigBuilder
              .getChipBuilder(filterConfigWithSelected)
              .chipsFor(activeFilters),
            onDelete: onFilterDelete,
          },
        },
        setActiveFilter: onFilterUpdate,
        activeFilters,
        activeFilterValues,
        addConfigItem,
        filterConfigBuilder,
        filterString: () =>
          filterConfigBuilder
            .getFilterBuilder(filterConfigWithSelected)
            .buildFilterString(activeFilters),
      }
    : {};
};

export default useFilterConfig;
