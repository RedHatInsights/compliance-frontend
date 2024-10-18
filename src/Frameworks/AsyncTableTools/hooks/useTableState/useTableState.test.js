import { useMemo } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { DEFAULT_RENDER_OPTIONS } from '../../utils/testHelpers';
import { useRawTableState } from '.';
import useTableState from './useTableState';

describe('useTableState', () => {
  const initialState = { page: 1, perPage: 10 };

  it('returns an array with a state and a function to set the state', async () => {
    const { result } = renderHook(
      () => useTableState('pagination', initialState),
      DEFAULT_RENDER_OPTIONS
    );

    await waitFor(() => expect(result.current[0]).toEqual(initialState));
  });

  it('can properly update a state', async () => {
    const { result } = renderHook(
      () => useTableState('pagination', initialState),
      DEFAULT_RENDER_OPTIONS
    );

    act(() => {
      result.current[1]({ page: 1, perPage: 20 });
    });

    await waitFor(() =>
      expect(result.current[0]).toEqual({ page: 1, perPage: 20 })
    );
  });

  it('sets a serialised state when provided with a serialiser', () => {
    const serialiser = (state) => {
      return `offset=${state.page}&limit=${state.perPage}`;
    };

    const { result } = renderHook(
      () => useTableState('pagination', initialState, { serialiser }),
      DEFAULT_RENDER_OPTIONS
    );

    expect(result.current[2]).toEqual('offset=1&limit=10');
  });

  describe('observers', () => {
    const state2ObserverMock = jest.fn();

    /*
     *
     *  This hook combines two tables state hooks and some context hooks to test interaction between them
     *
     */
    const useTwoTableStates = (options = {}) => {
      const { state1: state1Params = [], state2: state2Params = [] } = useMemo(
        () => options,
        [options]
      );
      const state1 = useTableState(...state1Params);
      const state2 = useTableState(...state2Params);
      const rawState = useRawTableState();

      return { [state1Params[0]]: state1, [state2Params[0]]: state2, rawState };
    };

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should accept observers and ', () => {
      const { result } = renderHook(
        () =>
          useTwoTableStates({
            state1: ['state1', {}, {}],
            state2: [
              'state2',
              {},
              { observers: { state1: () => state2ObserverMock() } },
            ],
          }),
        DEFAULT_RENDER_OPTIONS
      );

      expect(result.current.state1).toBeDefined();
      expect(result.current.state2).toBeDefined();
      expect(result.current.rawState).toBeDefined();
    });

    it('should accept observers to trigger mutate a state', () => {
      const observingState = { page: 1 };
      const { result } = renderHook(
        () =>
          useTwoTableStates({
            state1: ['state1', { filter: 'name=bastilian' }],
            state2: [
              'state2',
              { page: 5 },
              {
                observers: {
                  state1: () => observingState,
                },
              },
            ],
          }),
        DEFAULT_RENDER_OPTIONS
      );
      const newStateForState2 = { filter: 'name=sebastian' };

      act(() => {
        result.current.state1[1](newStateForState2);
      });

      expect(result.current.state1[0]).toEqual(newStateForState2);
      expect(result.current.state2[0]).toEqual(observingState);
    });

    it('should accept observer functions to mutate a state', () => {
      const filtersObserver = (
        currentState,
        observedPreviousState,
        observedNextState
      ) =>
        observedPreviousState.name !== observedNextState.name
          ? 'list'
          : currentState;

      const { result } = renderHook(
        () =>
          useTwoTableStates({
            state1: ['filters', { status: 'on' }],
            state2: [
              'tableView',
              'tree',
              {
                observers: {
                  filters: filtersObserver,
                },
              },
            ],
          }),
        DEFAULT_RENDER_OPTIONS
      );

      act(() => {
        result.current.filters[1]({ status: 'off' });
      });
      expect(result.current.tableView[0]).toEqual('tree');

      act(() => {
        result.current.filters[1]({ name: 'sebastian', status: 'off' });
      });

      expect(result.current.tableView[0]).toEqual('list');
      expect(result.current.filters[0]).toEqual({
        name: 'sebastian',
        status: 'off',
      });
    });
  });
});
