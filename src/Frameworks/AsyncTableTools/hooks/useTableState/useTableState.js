import { useEffect, useCallback, useContext, useState } from 'react';
import { TableContext } from './';

/**
 *  Provides an interface for hooks to store their states name-spaced into the tableState in the TableContext
 *
 *  @param {object} namespace A key to namespace the state under (e.g. 'filters', 'sort')
 *  @param {object} [initialState] Initial state to put into the table state
 *  @param {object} [options] Options for the state
 *  @param {object} [options.serialiser] A function to serialise the table state and allow access it via the useSerialisedTableState hook
 *
 *  @returns {Array} An array with the first item being the tableState, the second a function to set the state and a third optional item with the serialised state if a serialiser was provided
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useTableState = (namespace, initialState, options = {}) => {
  const { serialiser } = options;
  const internalState = useState();
  const { setTableState: setTableStateInContext, ...tableStateInContext } =
    useContext(TableContext) || {};

  const [state, setState] = setTableStateInContext
    ? [tableStateInContext, setTableStateInContext]
    : internalState;
  const { tableState, serialisedTableState } = state || {};

  const setTableState = useCallback(
    (state) => {
      setState((currentState) => ({
        tableState: {
          ...(currentState?.tableState || {}),
          [namespace]: state,
        },
        ...(serialiser
          ? {
              serialisedTableState: {
                ...(currentState?.serialisedTableState || {}),
                [namespace]: serialiser(state),
              },
            }
          : {}),
      }));
    },
    [namespace]
  );

  useEffect(() => {
    if (!setTableStateInContext) {
      console.log(
        '%cNo context provided for useTableState! Using internal state. Make sure a TableStateProvider is available.',
        'background: red; color: white; font-weight: bold;'
      );
    }

    initialState && setTableState(initialState);
  }, []);

  return [
    tableState?.[namespace] || initialState,
    setTableState,
    ...(serialiser ? [serialisedTableState?.[namespace]] : []),
  ];
};

export default useTableState;
