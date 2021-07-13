import { useState, useEffect, useMemo } from 'react';
import FilterConfigBuilder from './FilterConfigBuilder/FilterConfigBuilder';
import useSelectedFilter from './useSelectedFilter';

const filterValues = (activeFilters) => (
    Object.values(activeFilters).filter((value) => {
        if (typeof value === Object) {
            return Object.values(value).length > 0;
        }

        if (typeof value === Array) {
            return value.length > 0;
        }

        return !!value;
    })
);

const useFilterConfig = (options = {}) => {
    const {
        filters,
        setPage,
        selectedFilter
    } = options;
    const enableFilters = !!filters;
    const { filterConfig = [], activeFilters: initialActiveFilters } = filters || {};
    const filterConfigBuilder = new FilterConfigBuilder(filterConfig);
    const [activeFilters, setActiveFilters] = useState(
        filterConfigBuilder.initialDefaultState(initialActiveFilters)
    );
    const onFilterUpdate = (filter, value) => {
        setActiveFilters({
            ...activeFilters,
            [filter]: value
        });

        setPage && setPage(1);
    };

    const addConfigItem = (item) => {
        filterConfigBuilder.addConfigItem(item);
        setActiveFilters(filterConfigBuilder.initialDefaultState(
            activeFilters
        ));
    };

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
    const filterChips = chipBuilder.chipsFor(activeFilters);

    const filter = (items) => (
        filterConfigBuilder.applyFilterToObjectArray(
            items, activeFilters
        )
    );

    const {
        toolbarProps: selectedFilterToolbarProps, filterItem: selectFilterItem
    } = useSelectedFilter({
        activeFilters,
        setActiveFilter: onFilterUpdate,
        selectedFilter
    });

    const activeFilterValues = useMemo(() => (
        filterValues(activeFilters)
    ), [activeFilters]);

    useEffect(() => {
        filterConfigBuilder.config = [];
        [...filterConfig, selectFilterItem].filter((v) => (!!v)).forEach(addConfigItem);
        setActiveFilters(filterConfigBuilder.initialDefaultState(
            initialActiveFilters || []
        ));

        return () => {
            filterConfigBuilder.config = [];
        };
    }, []);

    return enableFilters ? {
        filter,
        selectedFilterToolbarProps,
        toolbarProps: {
            filterConfig: filterConfigBuilder.buildConfiguration(
                onFilterUpdate,
                activeFilters
            ),
            activeFiltersConfig: {
                filters: filterChips,
                onDelete: onFilterDelete
            }
        },
        setActiveFilter: onFilterUpdate,
        activeFilters,
        activeFilterValues,
        addConfigItem,
        filterConfigBuilder,
        filterString: () => filterConfigBuilder.getFilterBuilder().buildFilterString(activeFilters)
    } : {};
};

export default useFilterConfig;
