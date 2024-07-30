import { renderHook } from '@testing-library/react';
import { DEFAULT_RENDER_OPTIONS } from '../../utils/testHelpers';

import useTableState from './useTableState';

describe('useTableState', () => {
  const initialState = { page: 1, perPage: 10 };

  it('returns an array with a state and a function to set the state', () => {
    const { result } = renderHook(
      () => useTableState('pagination', initialState),
      DEFAULT_RENDER_OPTIONS
    );

    expect(result.current[0]).toEqual(initialState);
  });

  it('works without a context provider', () => {
    const { result } = renderHook(() =>
      useTableState('pagination', initialState)
    );

    expect(result.current[0]).toEqual(initialState);
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
});
