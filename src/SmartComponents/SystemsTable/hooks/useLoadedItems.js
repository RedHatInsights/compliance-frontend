import { useCallback, useEffect, useState } from 'react';
import unionBy from '../../../Utilities/unionBy';
import debounce from '@redhat-cloud-services/frontend-components-utilities/debounce';

const useLoadedItems = (currentPageItems, total, key = 'id') => {
  const [loadedItems, setLoadedItems] = useState(currentPageItems);
  const [allLoaded, setAllLoaded] = useState(false); // to avoid unnecessary requests

  const addToLoadedItems = useCallback(
    (items) => {
      setLoadedItems((loadedItems) => unionBy(items, loadedItems, key));
    },
    [key]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetLoadedItems = useCallback(
    debounce((newItems = []) => {
      setLoadedItems(newItems);
      setAllLoaded(total <= newItems.length);
    }, 200),
    []
  );

  useEffect(() => {
    setAllLoaded(total <= loadedItems.length);
  }, [total, loadedItems]);

  useEffect(() => {
    addToLoadedItems(currentPageItems);
  }, [currentPageItems, addToLoadedItems]);

  return { loadedItems, addToLoadedItems, resetLoadedItems, allLoaded };
};

export default useLoadedItems;
