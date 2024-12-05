import { renderHook, waitFor, act } from '@testing-library/react';
import { DEFAULT_RENDER_OPTIONS } from '../../utils/testHelpers';
import columns from '../../__fixtures__/columns';
import { useSerialisedTableState } from '../useTableState';
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

  it('returns a table sort configuration with an inital state', async () => {
    const { result } = renderHook(
      () =>
        useTableSort(columns, {
          sortBy: exampleSortBy,
        }),
      DEFAULT_RENDER_OPTIONS
    );

    await waitFor(() =>
      expect(result.current.tableProps.sortBy).toEqual(exampleSortBy)
    );
  });

  it('should allow changing the sort via onSort', async () => {
    const { result } = renderHook(
      () =>
        useTableSort(columns, {
          sortBy: exampleSortBy,
        }),
      DEFAULT_RENDER_OPTIONS
    );

    act(() => {
      result.current.tableProps.onSort(undefined, 1, 'desc');
    });

    await waitFor(() =>
      expect(result.current.tableProps.sortBy).toEqual({
        index: 1,
        direction: 'desc',
      })
    );
  });

  it('should allow changing the sort via onSort', async () => {
    const useTableSortWithSerialisedState = (...args) => {
      const serialised = useSerialisedTableState();
      const sort = useTableSort(...args);

      return {
        sort,
        serialised,
      };
    };
    const sortSerialiser = () => {
      return 'Serialised sort';
    };
    const { result } = renderHook(
      () =>
        useTableSortWithSerialisedState(columns, {
          sortBy: exampleSortBy,
          serialisers: {
            sort: sortSerialiser,
          },
        }),
      DEFAULT_RENDER_OPTIONS
    );

    act(() => {
      result.current.sort.tableProps.onSort(undefined, 2, 'desc');
    });

    await waitFor(() =>
      expect(result.current.sort.tableProps.sortBy).toEqual({
        index: 2,
        direction: 'desc',
      })
    );

    expect(result.current.serialised.sort).toEqual('Serialised sort');
  });
});
