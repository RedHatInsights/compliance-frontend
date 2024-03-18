import { renderHook } from '@testing-library/react';
import useTableSort, { useTableSortWithItems } from './useTableSort';
import columns from './__fixtures__/columns';

describe('useTableSort', () => {
  it('returns a table sort configuration', () => {
    const { result } = renderHook(() => useTableSort(columns));
    expect(result).toMatchSnapshot();
  });

  it('returns a table sort configuration with an inital state', () => {
    const sortBy = {
      index: 3,
      direction: 'asc',
    };
    const { result } = renderHook(() =>
      useTableSort(columns, {
        sortBy,
      })
    );
    expect(result.current.tableProps.sortBy).toEqual(sortBy);
  });
});

describe('useTableSortWithItems', () => {
  it('returns no sortBy when there are no items', () => {
    const sortBy = {
      index: 3,
      direction: 'asc',
    };
    const { result } = renderHook(() =>
      useTableSortWithItems([], columns, {
        sortBy,
      })
    );
    expect(result.current.tableProps.sortBy).toEqual(undefined);
  });
});
