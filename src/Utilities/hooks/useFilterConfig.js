import { useState } from 'react';
import FilterConfigBuilder from './useTableTools/FilterConfigBuilder/FilterConfigBuilder';

const filterValues = (activeFilters) => (
    Object.values(activeFilters).filter((value) => {
        if (typeof value === Object) {
            return Object.values(value).length > 0;
        }

        if (typeof value === Array) {
            return value?.length > 0;
        }

        return !!value;
    })
);

const useFilterConfig = (initialConfig, arrayToFilter) => {
    const filterConfigBuilder = new FilterConfigBuilder(initialConfig);
    const [activeFilters, setActiveFilters] = useState(filterConfigBuilder.initialDefaultState());
    const [activeFilterValues, setActiveFilterValues] = useState([]);
    const onFilterUpdate = (filter, value) => {
        const newActiveFilters = {
            ...activeFilters,
            [filter]: value
        };
        setActiveFilters(newActiveFilters);
        setActiveFilterValues(filterValues(newActiveFilters));
    };

    const clearAllFilter = () => (
        setActiveFilters(filterConfigBuilder.initialDefaultState())
    );

    const deleteFilter = (chips) => {
        const newActiveFilters = filterConfigBuilder.removeFilterWithChip(
            chips, activeFilters
        );
        setActiveFilters(newActiveFilters);
        setActiveFilterValues(filterValues(newActiveFilters));
    };

    const onFilterDelete = (_event, chips, clearAll = false) => (
        clearAll ? clearAllFilter() : deleteFilter(chips[0])
    );

    const chipBuilder = filterConfigBuilder.getChipBuilder();
    const filterConfig = filterConfigBuilder.buildConfiguration(
        onFilterUpdate,
        activeFilters
    );
    const filterChips = chipBuilder.chipsFor(activeFilters);
    const filteredArray = arrayToFilter ? filterConfigBuilder.applyFilterToObjectArray(
        arrayToFilter, activeFilters
    ) : undefined;

    return {
        conditionalFilter: {
            filterConfig,
            activeFiltersConfig: {
                filters: filterChips,
                onDelete: onFilterDelete
            }
        },
        filtered: filteredArray,
        activeFilters,
        activeFilterValues,
        filterString: !arrayToFilter ? filterConfigBuilder.getFilterBuilder().buildFilterString(activeFilters) : ''
    };
};

export default useFilterConfig;
