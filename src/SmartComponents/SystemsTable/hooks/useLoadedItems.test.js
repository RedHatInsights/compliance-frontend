import { act, renderHook, waitFor } from '@testing-library/react';
import useLoadedItems from './useLoadedItems';

describe('useLoadedItems', () => {
  let loadedItems = [];

  it('returns basic values', () => {
    const { result } = renderHook(() => useLoadedItems(loadedItems, 50));

    expect(result.current).toStrictEqual({
      loadedItems: [],
      addToLoadedItems: expect.anything(),
      resetLoadedItems: expect.anything(),
      allLoaded: false,
    });
  });

  it('returns basic values with loaded items', () => {
    loadedItems = [{ id: 'abc' }];
    const { result } = renderHook(() => useLoadedItems(loadedItems, 50));

    expect(result.current).toStrictEqual({
      loadedItems: [{ id: 'abc' }],
      addToLoadedItems: expect.anything(),
      resetLoadedItems: expect.anything(),
      allLoaded: false,
    });
  });

  it('can update loaded items', async () => {
    loadedItems = [{ id: 'abc' }];
    const { result } = renderHook(() => useLoadedItems(loadedItems, 50));

    act(() => {
      result.current.addToLoadedItems([{ id: 'test' }]);
    });

    await waitFor(() => {
      expect(result.current).toStrictEqual({
        loadedItems: [{ id: 'test' }, { id: 'abc' }],
        addToLoadedItems: expect.anything(),
        resetLoadedItems: expect.anything(),
        allLoaded: false,
      });
    });
  });

  it('identifies if all items are loaded', async () => {
    loadedItems = [{ id: 'abc' }];
    const { result } = renderHook(() => useLoadedItems(loadedItems, 1));

    await waitFor(() => {
      expect(result.current.allLoaded).toBe(true);
    });
  });

  it('identifies if not all items are loaded', async () => {
    loadedItems = [{ id: 'abc' }];
    const { result } = renderHook(() => useLoadedItems(loadedItems, 2));

    await waitFor(() => {
      expect(result.current.allLoaded).toBe(false);
    });
  });

  it('can reset loaded items', async () => {
    loadedItems = [{ id: 'abc' }];
    const { result } = renderHook(() => useLoadedItems(loadedItems, 1));

    const {
      loadedItems: resultLoadedItems,
      resetLoadedItems,
      allLoaded,
    } = result.current;

    expect(allLoaded).toBe(true);
    expect(resultLoadedItems).toStrictEqual(loadedItems);
    resetLoadedItems();

    await waitFor(() => {
      expect(result.current.allLoaded).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.loadedItems).toStrictEqual([]);
    });
  });
});
