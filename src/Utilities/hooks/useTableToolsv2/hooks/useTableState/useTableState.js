import { useEffect, useCallback, useContext } from 'react';
import { TableContext } from '../../utils';

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
        [namespace]: state,
      }));
    },
    [namespace]
  );

  useEffect(() => {
    initialState && setTableState(initialState);
  }, []);

  return [tableState[namespace], setTableState];
};

export default useTableState;
