import { useEffect, useMemo } from 'react';
import useSelectionManager from '../useSelectionManager';
import useTableState from '../useTableState';
import { toFilterConfig, toIdedFilters } from './filterConfigHelpers';
import { toFilterChips } from './filterChipHelpers';
import useEventHandlers from './useEventHandlers';
import { TABLE_STATE_NAMESPACE } from './constants';

/**
 *  @typedef {object} FilterConfig
 *
 *  @property {object} toolbarProps                     Object containing PrimaryToolbar props
 *  @property {object} toolbarProps.filterConfig        Object containing the filterConfig prop for the PrimaryToolbar
 *  @property {object} toolbarProps.activeFiltersConfig Object containing the activeFiltersConfigs prop for the PrimaryToolbar
 */

/**
 * Provides `PrimaryToolbar` props for the `ConditionalFilter` component filter configuration.
 *
 *  @param   {object}       [options]                       AsyncTableTools options
 *  @param   {object}       [options.filters.filterConfig]  An object containing filter definition
 *  @param   {object}       [options.filters.activeFilters] An object containing an initial active filters state
 *  @param   {object}       [options.serialisers.filters]   A function to serialise the filter table state
 *
 *  @returns {FilterConfig}                                 props for PrimaryToolbar/ConditionalFilter component
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useFilterConfig = (options = {}) => {
  const { filters, serialisers } = options;
  const enableFilters = !!filters;
  const { filterConfig = [], activeFilters: initialActiveFilters } =
    filters || {};

  const { selection: activeFilters, ...selectionActions } = useSelectionManager(
    initialActiveFilters,
    { withGroups: true }
  );

  const { onFilterUpdate, onFilterDelete } = useEventHandlers({
    ...options,
    activeFilters,
    selectionActions,
  });

  const builtFilterConfig = useMemo(
    () => toFilterConfig(filterConfig, activeFilters, onFilterUpdate),
    [filterConfig, activeFilters, onFilterUpdate]
  );

  const [, setTableState] = useTableState(
    TABLE_STATE_NAMESPACE,
    initialActiveFilters,
    serialisers?.filters
      ? {
          serialiser: (state) =>
            serialisers.filters(state, filterConfig.map(toIdedFilters)),
        }
      : {}
  );

  useEffect(() => {
    setTableState(activeFilters);
  }, [activeFilters, setTableState]);

  return enableFilters
    ? {
        toolbarProps: {
          filterConfig: builtFilterConfig,
          activeFiltersConfig: {
            filters: toFilterChips(filterConfig, activeFilters),
            onDelete: onFilterDelete,
          },
        },
      }
    : {};
};

export default useFilterConfig;
