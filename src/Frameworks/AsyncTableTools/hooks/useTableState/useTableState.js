import { useEffect, useCallback, useContext } from 'react';
import { TableContext } from './';

/**
 * Provides an interface for hooks to store their states namespaced into the tableState in the TableContext
 *
 * @param {Object} namespace A key to namespace the state under (e.g. 'filters', 'sort')
 * @param {Object} [initialState] Initial state to put into the table state
 * @param {Object} [options] Options for the state
 *
 * **Options:**
 *  * **serialiser** a function to serialise the table state and allow access it via the useSerialisedTableState hook
 *
 */
const useTableState = (namespace, initialState, options = {}) => {
  const { serialiser } = options;
  const {
    tableState,
    serialisedTableState,
    setTableState: setTableStateInContext,
  } = useContext(TableContext);

  const setTableState = useCallback(
    (state) => {
      setTableStateInContext((currentState) => ({
        tableState: {
          ...currentState.tableState,
          [namespace]: state,
        },
        ...(serialiser
          ? {
              serialisedTableState: {
                ...currentState.serialisedTableState,
                [namespace]: serialiser(state),
              },
            }
          : {}),
      }));
    },
    [namespace]
  );

  useEffect(() => {
    initialState && setTableState(initialState);
  }, []);

  return [
    tableState?.[namespace] || initialState,
    setTableState,
    ...(serialiser ? [serialisedTableState?.[namespace]] : []),
  ];
};

export default useTableState;
