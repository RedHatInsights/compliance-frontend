import { useCallback, useRef, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useBulkSelect } from 'bastilian-tabletools';
import { setDisabledSelection } from 'Store/Actions/SystemActions';

const useSystemsBulkSelect = ({
  fetchSystemsBatched,
  onSelect,
  resultCache,
  setIsSystemsDataLoading,
  selected,
  ...bulkSelectOptions
}) => {
  const dispatch = useDispatch();
  const itemCache = useRef();
  const itemIdsOnPage = useMemo(
    () => resultCache?.data?.map(({ id }) => id),
    [resultCache],
  );

  const itemIdsInTable = useCallback(async () => {
    itemCache.current = undefined;
    setIsSystemsDataLoading?.(true);
    dispatch(setDisabledSelection(true));

    const results = await fetchSystemsBatched();
    const items = results?.data;
    itemCache.current = items;

    setIsSystemsDataLoading?.(false);

    return items.map(({ id }) => id);
  }, [fetchSystemsBatched, dispatch, setIsSystemsDataLoading]);

  const onSelectCallback = useCallback(
    (selectedIds) => {
      const selectedItems = selectedIds.map((id) => ({
        id,
        ...resultCache.data?.find(({ id: itemId }) => id === itemId),
        ...itemIdsOnPage?.find(({ id: itemId }) => id === itemId),
      }));

      // Ensures rows are marked as selected in the inventory table
      dispatch({
        type: 'SELECT_ENTITIES',
        payload: {
          selected: selectedIds,
        },
      });

      itemCache.current = selectedItems;
      dispatch(setDisabledSelection(false));

      if (typeof onSelect === 'function') {
        onSelect?.(selectedItems);
      }
    },
    [dispatch, onSelect, itemIdsOnPage, resultCache],
  );

  const bulkSelect = useBulkSelect({
    selected,
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

  return {
    ...bulkSelect,
    selectedItemCache: itemCache.current || [],
    markEntitySelected,
  };
};

export default useSystemsBulkSelect;
