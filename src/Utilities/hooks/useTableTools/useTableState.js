import { useEffect, useCallback, useContext } from 'react';
import { TableContext } from '.';

/**
 * Provides an interface for hooks to store their states namespaced into the tableState in the TableContext
 *
 * @param {Object} namespace A key to namespace the state under (e.g. 'filters', 'sort')
 * @param {Object} [initialState] Initial state to put into the table state
 */
const useTableState = (namespace, initialState) => {
  const { tableState, setTableState: setTableStateInContext } =
    useContext(TableContext);

  const setTableState = useCallback(
    (state) => {
      setTableStateInContext((tableState) => ({
        ...tableState,
        [namespace]: typeof state === 'function' ? state(tableState) : state,
      }));
    },
    [namespace]
  );

  useEffect(() => {
    initialState && setTableState(initialState);
  }, []);

  return [tableState[namespace] || initialState, setTableState];
};

export default useTableState;
