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
      observingStateObserverState: (_a, _b, observedState) =>
        typeof observedState?.length > 0,
    },
    observingStateObserverState: {
      secondObservingStateObserverState: (_a, _b, observedState) =>
        observedState === false,
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

  it('returns a table state with an observing state change', () => {
    expect(
      compileState(namespace, currentState, newState, observers, {})
    ).toEqual({
      tableState: {
        observedState: [],
        observingState: true,
        observingStateObserverState: false,
        secondObservingStateObserverState: true,
      },
    });
  });

  it.only('returns a table state with serialiased states', () => {
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
        observingStateObserverState: false,
        secondObservingStateObserverState: true,
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
