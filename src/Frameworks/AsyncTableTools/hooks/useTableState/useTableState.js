import { useEffect, useCallback, useContext } from 'react';
import { TableContext } from './';

/**
 *  Provides an interface for hooks to store their states name-spaced into the tableState in the TableContext
 *
 *  @param {object} namespace A key to namespace the state under (e.g. 'filters', 'sort')
 *  @param {object} [initialState] Initial state to put into the table state
 *  @param {object} [options] Options for the state
 *  @param {object} [options.serialiser] A function to serialise the table state and allow access it via the useSerialisedTableState hook
 *
 *  @returns {Array}
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
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
