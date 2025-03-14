import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import useBulkSelect from '@/Frameworks/AsyncTableTools/hooks/useBulkSelect';
import { setDisabledSelection } from 'Store/Actions/SystemActions';

const useSystemsBulkSelect = ({
  fetchSystemsBatched,
  onSelect,
  resultCache,
  ...bulkSelectOptions
}) => {
  const dispatch = useDispatch();
  const itemCache = useRef();
  const itemIdsOnPage = resultCache?.current?.data?.map(({ id }) => id);

  const itemIdsInTable = useCallback(async () => {
    itemCache.current = undefined;
    dispatch(setDisabledSelection(true));

    const results = await fetchSystemsBatched();
    const items = results?.data;
    itemCache.current = items;

    return items.map(({ id }) => id);
  }, [fetchSystemsBatched, dispatch]);

  const onSelectCallback = useCallback(
    (selectedIds) => {
      const selectedItems = selectedIds.map((id) => ({
        id,
        ...resultCache.current?.data?.find(({ id: itemId }) => id === itemId),
        ...itemIdsOnPage.find(({ id: itemId }) => id === itemId),
      }));

      itemCache.current = undefined;
      dispatch(setDisabledSelection(false));

      if (typeof onSelect === 'function') {
        onSelect?.(selectedItems);
      }
    },
    [dispatch, onSelect, itemIdsOnPage, resultCache],
  );

  const bulkSelect = useBulkSelect({
    ...(onSelect ? { onSelect: onSelectCallback } : {}),
    itemIdsInTable,
    itemIdsOnPage,
    ...bulkSelectOptions,
  });

  const markEntitySelected = useCallback(
    (entity) => ({
      ...entity,
      selected: bulkSelect?.tableView?.isItemSelected(entity.item.itemId),
    }),
    [bulkSelect],
  );

  // Ensures rows are marked as selected in the inventory table
  useEffect(() => {
    dispatch({
      type: 'SELECT_ENTITIES',
      payload: {
        selected: bulkSelect?.tableView.selected,
      },
    });
  }, [dispatch, bulkSelect?.tableView.selected]);

  return {
    ...bulkSelect,
    selectedItemCache: itemCache,
    markEntitySelected,
  };
};

export default useSystemsBulkSelect;
