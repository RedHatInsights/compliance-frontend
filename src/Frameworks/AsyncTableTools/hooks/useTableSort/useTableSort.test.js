import { renderHook, act } from '@testing-library/react';
import { DEFAULT_RENDER_OPTIONS } from '../../utils/testHelpers';
import columns from 'Utilities/hooks/useTableTools/__fixtures__/columns';

import useTableSort from './useTableSort';

describe('useTableSort', () => {
  const exampleSortBy = {
    index: 3,
    direction: 'asc',
  };

  it('returns a table sort configuration', () => {
    const { result } = renderHook(
      () => useTableSort(columns),
      DEFAULT_RENDER_OPTIONS
    );
    expect(result.current.tableProps).toBeDefined();
  });

  it('returns a table sort configuration with an inital state', () => {
    const { result } = renderHook(
      () =>
        useTableSort(columns, {
          sortBy: exampleSortBy,
        }),
      DEFAULT_RENDER_OPTIONS
    );

    expect(result.current.tableProps.sortBy).toEqual(exampleSortBy);
  });

  it('should allow changing the sort via onSort', async () => {
    const { result } = renderHook(
      () =>
        useTableSort(columns, {
          sortBy: exampleSortBy,
        }),
      DEFAULT_RENDER_OPTIONS
    );

    await act(() => {
      result.current.tableProps.onSort(undefined, 1, 'desc');
    });

    expect(result.current.tableProps.sortBy).toEqual({
      index: 1,
      direction: 'desc',
    });
  });
});
