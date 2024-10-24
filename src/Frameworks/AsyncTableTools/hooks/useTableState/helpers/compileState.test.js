import compileState from './compileState';

describe('compileState', function () {
  const namespace = 'observedState';
  const currentState = {};
  const newState = [];
  const observers = {
    observedState: {
      observingState: (_a, _b, observedState) =>
        typeof observedState?.length !== 'undefined',
    },
    observingState: {
      observingStateObserverState: (_a, _b, observingState) =>
        typeof observingState === 'boolean',
    },
    observingStateObserverState: {
      secondObservingStateObserverState: (
        _a,
        _b,
        observingStateObserverState
      ) => observingStateObserverState === false,
    },
  };

  const serialisers = {
    observingState: () => 'serialisedObservingState',
    observedState: () => 'serialisedObservedState',
  };

  it('returns a table state', () => {
    expect(compileState(namespace, currentState, newState, {}, {})).toEqual({
      tableState: {
        observedState: [],
      },
    });
  });

  it.skip('returns a table state with an observing state change', () => {
    // TODO Make this test pass
    // To solve the issue we need to make compileState iterate recursively over new states, its observers, and the observers of these new states.
    // The applyObservers function will need to be changed for this, mostly.
    // the flow should be newState, apply observers for changed state and get the next state, apply observers for the changed states, to get the next new state, ....
    // ... and finally return the resulting state after there are no more observers for a changed state
    const withMoreObservers = {
      ...observers,
      secondObservingStateObserverState: {
        secondObservingStateObserverState2: (
          _a,
          _b,
          secondObservingStateObserverState
        ) => (secondObservingStateObserverState === true ? 'yolo' : 'null'),
      },
      secondObservingStateObserverState2: {
        secondObservingStateObserverState3: (
          _a,
          _b,
          secondObservingStateObserverState2
        ) => secondObservingStateObserverState2 === 'null',
      },
      secondObservingStateObserverState3: {
        secondObservingStateObserverState4: () => 'yolo',
      },
    };

    expect(
      compileState(namespace, currentState, newState, withMoreObservers, {})
    ).toEqual({
      tableState: {
        observedState: [], // is [] since newState is []
        observingState: true, // is true, because observed state is an array and has a `length` defined
        observingStateObserverState: true, // true because observingState is a boolean
        secondObservingStateObserverState: false, // is false because observingStateObserverState is true, not false
        secondObservingStateObserverState2: 'null', // is null because secondObservingStateObserverState is false, not true
        secondObservingStateObserverState3: true, // is true, because secondObservingStateObserverState2 is 'null'
        secondObservingStateObserverState4: 'yolo',
      },
    });
  });

  it('returns a table state with serialiased states', () => {
    expect(
      compileState(
        namespace,
        {
          tableState: {
            justAnotherState: 'String',
            justAnotherIntegerState: 1,
            observedState: [],
            unobservedState: {
              nest: {
                ilike: 'birds',
              },
            },
            unobservingState: false,
            observingStateObserverState: true,
          },
        },
        newState,
        observers,
        serialisers
      )
    ).toEqual({
      tableState: {
        justAnotherState: 'String',
        justAnotherIntegerState: 1,
        observedState: [],
        observingState: true,
        unobservedState: {
          nest: {
            ilike: 'birds',
          },
        },
        unobservingState: false,
        observingStateObserverState: true,
        secondObservingStateObserverState: false,
      },
      serialisedTableState: {
        observingState: 'serialisedObservingState',
        observedState: 'serialisedObservedState',
      },
    });
  });

  it('returns a table state with states of observer states', () => {
    expect(
      compileState(
        'filters',
        {
          tableState: {
            view: 'tree',
            pagination: {
              isDisabled: true,
            },
          },
        },
        { name: ['t'] },
        {
          filters: {
            view: () => 'rows',
            pagination: (currentState) => ({
              ...currentState,
              page: 1,
            }),
          },
          view: {
            pagination: () => ({
              isDisabled: false,
            }),
          },
        },
        {}
      )
    ).toEqual({
      tableState: {
        view: 'rows',
        pagination: {
          isDisabled: false,
          page: 1,
        },
        filters: {
          name: ['t'],
        },
      },
    });
  });
});
