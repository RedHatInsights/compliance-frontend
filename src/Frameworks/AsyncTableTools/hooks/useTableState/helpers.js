export const withSerialising = (namespace, currentState, state, serialiser) => {
  return {
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
  };
};

export const applyObserverStates = (
  namespace,
  currentState,
  newState,
  observersForNamespace,
  serialisersInContext
) =>
  Object.entries(observersForNamespace).reduce(
    (compiledState, [observerNamespace, observerFunction]) => {
      const newObserverState =
        typeof observerFunction === 'function'
          ? observerFunction(
              compiledState.tableState[observerNamespace],
              currentState.tableState[namespace],
              compiledState.tableState[namespace]
            )
          : observerFunction;

      const newSerialisedState = withSerialising(
        observerNamespace,
        compiledState,
        newObserverState,
        serialisersInContext?.[observerNamespace]
      );

      return {
        ...compiledState,
        ...newSerialisedState,
      };
    },
    newState
  );
