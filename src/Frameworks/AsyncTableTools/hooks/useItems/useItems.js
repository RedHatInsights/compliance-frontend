import useDeepCompareEffect from 'use-deep-compare-effect';
import useTableState, {
  useSerialisedTableState,
  useRawTableState,
} from '../useTableState';
import { TABLE_STATE_NAMESPACE } from './constants';

const itemObserver = (
  _currentState,
  _observedPreviousState,
  observedNextItems
) => typeof observedNextItems?.length !== 'undefined';

/**
 * This hook handles either just returning a provided array of items
 * or calls a provided async (fetch) function to load an array of items
 *
 *  @param   {Array | Function} itemsProp An array or (async) function that returns an array of items to render or an async function to call with the tableState and serialised table state
 *
 *  @returns {Array}                      An array of items from the itemsProp passed in or a return from it as a function
 *
 *  @category AsyncTableTools
 *  @subcategory internal
 *
 *  TODO it might be good to use this hook as well to "identify" items similar to the `useItemIdentify` hook
 *
 */
const useItems = (itemsProp) => {
  const [items, setItems] = useTableState('items');
  const [loaded] = useTableState('loaded', false, {
    observers: {
      [TABLE_STATE_NAMESPACE]: itemObserver,
    },
  });
  const tableState = useRawTableState();
  const serialisedTableState = useSerialisedTableState();

  useDeepCompareEffect(() => {
    const setStateFromAsyncItems = async () => {
      if (typeof itemsProp === 'function') {
        const items = await itemsProp(serialisedTableState, tableState);
        setItems(items);
      } else {
        setItems(itemsProp);
      }
    };

    setStateFromAsyncItems();
  }, [
    setItems,
    itemsProp,
    JSON.stringify(serialisedTableState),
    JSON.stringify(tableState),
  ]);

  return {
    loaded,
    items,
  };
};

export default useItems;
