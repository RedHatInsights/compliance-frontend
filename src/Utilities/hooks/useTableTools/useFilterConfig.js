import { useState, useEffect } from 'react';
import FilterConfigBuilder from './FilterConfigBuilder/FilterConfigBuilder';
import useSelectedFilter from './useSelectedFilter';

const filterConfigBuilder = new FilterConfigBuilder([]);

const useFilterConfig = (options = {}) => {
    const {
        filters,
        setPage,
        selectedFilter
    } = options;
    const enableFilters = !!filters;
    const { filterConfig = [], activeFilters: initialActiveFilters } = filters || {};
    const [activeFilters, setActiveFilters] = useState({});
    const onFilterUpdate = (filter, value) => {
        setActiveFilters({
            ...activeFilters,
            [filter]: value
        });

        setPage && setPage(1);
    };

    const buildConfig = () => (
        filterConfigBuilder.buildConfiguration(
            onFilterUpdate,
            activeFilters
        )
    );

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
            filterConfig: buildConfig(),
            activeFiltersConfig: {
                filters: filterChips,
                onDelete: onFilterDelete
            }
        },
        setActiveFilter: onFilterUpdate,
        activeFilters,
        addConfigItem,
        filterConfigBuilder
    } : {};
};

export default useFilterConfig;
