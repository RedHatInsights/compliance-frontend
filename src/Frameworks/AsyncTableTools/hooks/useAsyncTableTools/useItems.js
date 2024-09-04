import { useEffect, useRef, useState } from 'react';
import { useSerialisedTableState, useRawTableState } from '../useTableState';

/**
 *  This hook handles either just returning a provided array of items
 *  or calls a provided async (fetch) function to load an array of items
 *
 *  @param {Array | Function} itemsProp An array or (async) function that returns an array of items to render or an async function to call with the tableState and serialised table state
 *
 *  @returns {Array} An array of items from the itemsProp passed in or a return from it as a function
 *
 *  @category AsyncTableTools
 *  @subcategory internal
 *
 * TODO it might be good to use this hook as well to "identify" items similar to the `useItemIdentify` hook
 *
 */
const useItems = (itemsProp) => {
  const mounted = useRef(true);
  const [items, setItems] = useState([]);
  const tableState = useRawTableState();
  const serialisedTableState = useSerialisedTableState();

  useEffect(() => {
    const setStateFromAsyncItems = async () => {
      const items = await itemsProp(serialisedTableState, tableState);

      if (mounted.current) {
        setItems(items);
      }
    };

    if (typeof itemsProp === 'function') {
      setStateFromAsyncItems();
    } else {
      setItems(itemsProp);
    }

    return () => {
      mounted.current = false;
    };
  }, []);

  return items;
};

export default useItems;
