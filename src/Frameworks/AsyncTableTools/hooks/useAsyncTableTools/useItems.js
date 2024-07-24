import { useEffect, useRef, useState } from 'react';
import { useSerialisedTableState, useRawTableState } from '../useTableState';

const useItems = (itemsProp) => {
  const mounted = useRef(true);
  const [items, setItems] = useState();
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
