import { useCallback } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import useContextOrInternalStateAndRefs from './hooks/useContextOrInternalStateAndRefs';
import useStateObservers from './hooks/useStateObservers';
import useSerialisers from './hooks/useSerialisers';
import { withSerialising, applyObserverStates } from './helpers';

/**
 * Provides an interface for hooks to store their states name-spaced into the tableState in the TableContext
 *
 *  @param   {object} namespace            A key to namespace the state under (e.g. 'filters', 'sort')
 *  @param   {object} [initialState]       Initial state to put into the table state
 *  @param   {object} [options]            Options for the state
 *  @param   {object} [options.serialiser] A function to serialise the table state and allow access it via the useSerialisedTableState hook
 *  @param   {object} [options.observers]  An object with properties of an other state namespace and an object or function returning an object with an desired state should the other state change
 *
 *  @returns {Array}                       An array with the first item being the tableState, the second a function to set the state and a third optional item with the serialised state if a serialiser was provided
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useTableState = (namespace, initialState, options = {}) => {
  const context = useContextOrInternalStateAndRefs();
  const { state: contextState, serialisers: serialisersInContext } = context;
  const [state, setState] = contextState || [];
  const { tableState, serialisedTableState } = state || {};
  const observersForNamespace = useStateObservers(namespace, options.observers);
  const serialiserForNamespace = useSerialisers(namespace, options.serialiser);

  const setTableState = useCallback(
    function setStateInner(nextState) {
      setState((currentState) => {
        const newState = withSerialising(
          namespace,
          currentState,
          nextState,
          serialiserForNamespace
        );

        if (observersForNamespace) {
          return applyObserverStates(
            namespace,
            currentState,
            newState,
            observersForNamespace,
            serialisersInContext
          );
        } else {
          return newState;
        }
      });
    },
    [
      setState,
      namespace,
      serialisersInContext,
      observersForNamespace,
      serialiserForNamespace,
    ]
  );

  useDeepCompareEffect(() => {
    if (initialState) {
      initialState && setTableState(initialState);
    }
  }, [initialState, setTableState]);

  return [
    tableState?.[namespace],
    setTableState,
    ...(options.serialiser ? [serialisedTableState?.[namespace]] : []),
  ];
};

export default useTableState;
