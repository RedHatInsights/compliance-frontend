import { useState } from 'react';
import { FilterConfigBuilder } from '@redhat-cloud-services/frontend-components-inventory-compliance/Utilities';

const useFilterConfig = (initialConfig, arrayToFilter) => {
    const filterConfigBuilder = new FilterConfigBuilder(initialConfig);
    const [activeFilters, setActiveFilters] = useState(filterConfigBuilder.initialDefaultState());
    const onFilterUpdate = (filter, value) => (
        setActiveFilters({
            ...activeFilters,
            [filter]: value
        })
    );
    const clearAllFilter = () => (
        setActiveFilters(filterConfigBuilder.initialDefaultState())
    );
    const deleteFilter = (chips) => (
        setActiveFilters(filterConfigBuilder.removeFilterWithChip(
            chips, activeFilters
        ))
    );
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
        buildFilterString: () => filterConfigBuilder.getFilterBuilder().buildFilterString(activeFilters)
    };
};

export default useFilterConfig;
