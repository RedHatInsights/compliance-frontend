import { useCallback, useEffect, useState } from 'react';
import unionBy from '../../../Utilities/unionBy';

const useLoadedItems = (currentPageItems, total, key = 'id') => {
  const [loadedItems, setLoadedItems] = useState(currentPageItems || []);
  const [allLoaded, setAllLoaded] = useState(false); // to avoid unnecessary requests

  const addToLoadedItems = useCallback(
    (items) => {
      setLoadedItems((loadedItems) => unionBy(items, loadedItems, key));
    },
    [key]
  );

  useEffect(() => {
    setAllLoaded(total <= loadedItems.length);
  }, [total, loadedItems]);

  useEffect(() => {
    addToLoadedItems(currentPageItems || []);
  }, [currentPageItems, addToLoadedItems]);

  return { loadedItems, addToLoadedItems, allLoaded };
};

export default useLoadedItems;
