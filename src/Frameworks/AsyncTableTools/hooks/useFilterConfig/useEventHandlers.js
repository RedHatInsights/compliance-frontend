import { useCallback } from 'react';
import { toSelectValue } from './filterConfigHelpers';
import { toDeselectValue } from './filterChipHelpers';

const useEventHandlers = ({
  filters: { filterConfig } = {},
  activeFilters,
  onFilterUpdate: onFilterUpdateCallback,
  onDeleteFilter,
  resetOnClear,
  selectionActions: { select, deselect, reset, clear },
}) => {
  const onFilterUpdate = useCallback(
    (filter, selectedValue, selectedValues) => {
      select(
        ...toSelectValue(filterConfig, filter, selectedValue, selectedValues)
      );
      onFilterUpdateCallback?.();
    },
    [filterConfig, select, onFilterUpdateCallback]
  );

  const onFilterDelete = useCallback(
    async (_event, chips, clearAll = false) => {
      clearAll
        ? resetOnClear
          ? reset()
          : clear()
        : deselect(...toDeselectValue(filterConfig, chips[0], activeFilters));
      onDeleteFilter?.(chips, clearAll);
    },
    [
      filterConfig,
      activeFilters,
      onDeleteFilter,
      reset,
      clear,
      deselect,
      resetOnClear,
    ]
  );

  return { onFilterUpdate, onFilterDelete };
};

export default useEventHandlers;
