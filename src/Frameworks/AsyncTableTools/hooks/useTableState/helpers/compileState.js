import merge from 'lodash/merge';

const applySerialisers = (serialisers, newState) =>
  Object.entries(serialisers).reduce(
    (newSerialisedState, [serialiserNamespace, serialiser]) => {
      return {
        ...newSerialisedState,
        ...(serialiser && typeof serialiser === 'function'
          ? {
              [serialiserNamespace]: serialiser(newState[serialiserNamespace]),
            }
          : {}),
      };
    },
    {}
  );

const applyNameSpaceObserver = (namespace, observers, newState, currentState) =>
  Object.entries(observers[namespace] || {}).reduce(
    (newObserverStatesAcc, [observingState, observerFunction]) => {
      const newObservingState = observerFunction(
        currentState?.[observingState],
        currentState?.[namespace],
        newState[namespace]
      );
      console.log(
        'Observer func:',
        namespace,
        observingState,
        newObservingState
      );
      return {
        ...newObserverStatesAcc,
        ...(typeof newObservingState !== 'undefined'
          ? { [observingState]: newObservingState }
          : {}),
      };
    },
    {}
  );

const applyObservers = (namespace, observers, newState, currentState) => {
  const newObserverStates = applyNameSpaceObserver(
    namespace,
    observers,
    newState,
    currentState
  );
  const observerObservingStates = Object.keys(newObserverStates).reduce(
    (acc, observingState) => ({
      ...acc,
      ...applyNameSpaceObserver(
        observingState,
        observers,
        {
          ...newState,
          ...newObserverStates,
        },
        currentState
      ),
    }),
    {}
  );

  const observerObservingObserverStates = Object.keys(
    observerObservingStates
  ).reduce(
    (acc, observingState) => ({
      ...acc,
      ...applyNameSpaceObserver(
        observingState,
        observers,
        {
          ...newState,
          ...newObserverStates,
          ...observerObservingStates,
        },
        currentState
      ),
    }),
    {}
  );
  console.log(newObserverStates);
  console.log(observerObservingStates);
  console.log(observerObservingObserverStates);
  return merge(
    currentState,
    merge(
      newState,
      merge(
        newObserverStates,
        merge(observerObservingStates, observerObservingObserverStates)
      )
    )
  );
};

const compileState = (
  namespace,
  currentState,
  newStateForNameSpace,
  observers,
  serialisers
) => {
  const newStateTableState = {
    ...(currentState?.tableState || {}),
    [namespace]: newStateForNameSpace,
  };
  const newStateWithObservers = applyObservers(
    namespace,
    observers,
    newStateTableState,
    currentState?.tableState || {}
  );
  const newSerialisedState = applySerialisers(
    serialisers,
    newStateWithObservers
  );

  return {
    tableState: newStateWithObservers,
    ...(Object.keys(newSerialisedState).length
      ? { serialisedTableState: newSerialisedState }
      : {}),
  };
};

export default compileState;
