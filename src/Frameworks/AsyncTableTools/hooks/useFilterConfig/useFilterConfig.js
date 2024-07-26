import { useEffect, useMemo } from 'react';
import useSelectionManager from '../useSelectionManager';
import { toFilterConfig, toIdedFilters } from './filterConfigHelpers';
import { toFilterChips } from './filterChipHelpers';
import useTableState from '../useTableState';
import useEventHandlers from './useEventHandlers';

// TODO add tests
/**
 * Provides `PrimaryToolbar` props for the `ConditionalFilter` component filter configuration.
 *
 * @param {Object} [options]
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
    'filters',
    initialActiveFilters,
    serialisers?.filters
      ? {
          serialiser: (state) =>
            serialisers.filters(state, filterConfig.map(toIdedFilters)),
        }
      : {}
  );

  useEffect(() => {
    activeFilters && setTableState(activeFilters);
  }, [activeFilters]);

  return enableFilters
    ? {
        toolbarProps: {
          filterConfig: builtFilterConfig,
          activeFiltersConfig: {
            filters: toFilterChips(filterConfig, activeFilters),
            onDelete: onFilterDelete,
          },
        },
        activeFilters,
      }
    : {};
};

export default useFilterConfig;
