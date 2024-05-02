import { renderHook, waitFor, act } from '@testing-library/react';
import { useBulkSelect, useBulkSelectWithItems } from './useBulkSelect';
import items from './__fixtures__/items';
import useItemIdentify from './useItemIdentify';

describe('useBulkSelect', () => {
  const defaultOptions = {
    total: 0,
    onSelect: () => ({}),
    itemIdsInTable: () => [],
    itemIdsOnPage: () => [],
  };

  it('returns a bulk select configuration', () => {
    const { result } = renderHook(() => useBulkSelect(defaultOptions));

    expect(result).toMatchObject({});
  });

  it('returns a bulk select configuration with the correct options', () => {
    const { result } = renderHook(() =>
      useBulkSelect({
        ...defaultOptions,
        total: 1,
        preselected: ['ID'],
        itemIdsInTable: () => ['ID'],
        itemIdsOnPage: () => ['ID'],
      })
    );

    expect(result.current).toMatchObject({});
  });

  it('returns a bulk select configuration with the correct options', () => {
    const { result } = renderHook(() =>
      useBulkSelect({
        ...defaultOptions,
        total: 2,
        preselected: ['ID'],
        itemIdsInTable: () => ['ID', 'ID2'],
        itemIdsOnPage: () => ['ID', 'ID2'],
      })
    );

    expect(result.current).toMatchObject({});
  });

  it('returns a bulk select configuration with the correct options', () => {
    const { result } = renderHook(() =>
      useBulkSelect({
        ...defaultOptions,
        total: 2,
        preselected: ['ID'],
        itemIdsInTable: () => ['ID', 'ID2'],
        itemIdsOnPage: () => ['ID'],
      })
    );

    expect(result.current).toMatchObject({});
  });
});

describe('useBulkSelectWithItems', () => {
  const exampleItems = useItemIdentify(items(20));
  const defaultOptions = {
    onSelect: () => ({}),
    items: exampleItems,
    perPage: 10,
    preselected: [],
  };
  const getBulkSelect = (result) => result.current.toolbarProps.bulkSelect;
  const getSelectNone = (result) =>
    result.current.toolbarProps.bulkSelect.items[0];
  const getSelectPage = (result) =>
    result.current.toolbarProps.bulkSelect.items[1];
  const getSelectAll = (result) =>
    result.current.toolbarProps.bulkSelect.items[2];

  it('returns a allows to select one', async () => {
    const item = exampleItems[5];
    const { result } = renderHook(() => useBulkSelectWithItems(defaultOptions));

    act(() => {
      result.current.tableProps.onSelect(undefined, true, 'key', item);
    });

    await waitFor(() =>
      expect(result.current.transformer(item)).toMatchObject({
        description: 'DESCRIPTION',
        id: 6,
        itemId: 6,
        name: 'TEST ITEM #6',
        rowProps: {
          selected: true,
        },
        severity: 'low',
      })
    );
  });

  it('returns a allows to select/deselect all', async () => {
    const { result } = renderHook(() => useBulkSelectWithItems(defaultOptions));
    expect(getBulkSelect(result).toggleProps).toEqual({
      children: ['0 selected'],
      count: 20,
    });

    getSelectAll(result).onClick();
    await waitFor(() => expect(getBulkSelect(result).checked).toBe(true));
    expect(getBulkSelect(result).toggleProps).toEqual({
      children: ['20 selected'],
      count: 20,
    });

    getSelectAll(result).onClick();
    await waitFor(() =>
      expect(getBulkSelect(result).toggleProps).toEqual({
        children: ['0 selected'],
        count: 20,
      })
    );
  });

  it('returns a allows to select/deselect page', async () => {
    const { result } = renderHook(() => useBulkSelectWithItems(defaultOptions));
    expect(getBulkSelect(result).toggleProps).toEqual({
      children: ['0 selected'],
      count: 20,
    });

    getSelectPage(result).onClick();
    // FIXME In case where there are more items than items per page this should be null to show a [-] checkbox
    await waitFor(() => expect(getBulkSelect(result).checked).toBe(true));
    expect(getBulkSelect(result).toggleProps).toEqual({
      children: ['20 selected'],
      count: 20,
    });

    getSelectPage(result).onClick();

    await waitFor(() =>
      expect(getBulkSelect(result).toggleProps).toEqual({
        children: ['0 selected'],
        count: 20,
      })
    );
  });

  it('returns to select none after all selected', async () => {
    const { result } = renderHook(() => useBulkSelectWithItems(defaultOptions));
    expect(getBulkSelect(result).toggleProps).toEqual({
      children: ['0 selected'],
      count: 20,
    });

    getSelectAll(result).onClick();
    await waitFor(() => expect(getBulkSelect(result).checked).toBe(true));
    expect(getBulkSelect(result).toggleProps).toEqual({
      children: ['20 selected'],
      count: 20,
    });

    getSelectNone(result).onClick();
    await waitFor(() =>
      expect(getBulkSelect(result).toggleProps).toEqual({
        children: ['0 selected'],
        count: 20,
      })
    );
  });

  it('returns respects filtered results', async () => {
    const { result } = renderHook(() =>
      useBulkSelectWithItems({
        ...defaultOptions,
        filter: (items) => items.slice(5, 10),
      })
    );
    expect(getBulkSelect(result)).toMatchObject({});

    getSelectAll(result).onClick();

    await waitFor(() =>
      expect(getBulkSelect(result).toggleProps).toEqual({
        children: ['5 selected'],
        count: 5,
      })
    );
  });
});
