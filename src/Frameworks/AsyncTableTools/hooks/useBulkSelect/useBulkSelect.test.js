import useBulkSelect from './useBulkSelect';
import { renderHook } from '@testing-library/react';

describe('useBulkSelect', () => {
  const defaultOptions = {
    total: 0,
    onSelect: () => ({}),
    itemIdsInTable: () => [],
    itemIdsOnPage: [],
  };

  it('returns a bulk select configuration', () => {
    const { result } = renderHook(() => useBulkSelect(defaultOptions));

    expect(result).toMatchSnapshot();
  });

  it('returns a bulk select configuration without select all', () => {
    const { result } = renderHook(() =>
      useBulkSelect({
        ...defaultOptions,
        total: 2,
        preselected: ['ID'],
        itemIdsInTable: () => {
          return ['ID', 'ID1'];
        },
        itemIdsOnPage: ['ID', 'ID1'],
      })
    );

    expect(result.current.toolbarProps.bulkSelect.items).toMatchSnapshot();
  });

  it('returns a bulk select configuration with select all', () => {
    const { result } = renderHook(() =>
      useBulkSelect({
        ...defaultOptions,
        total: 2,
        preselected: ['ID'],
        fetchAll: Promise.resolve(['2417de', '51b20a']),
        itemIdsOnPage: ['ID', 'ID1'],
      })
    );

    expect(result.current.toolbarProps.bulkSelect.items).toMatchSnapshot();
  });

  it('returns a bulk select configuration with 1 selected item', () => {
    const { result } = renderHook(() =>
      useBulkSelect({
        ...defaultOptions,
        total: 2,
        preselected: ['ID'],
        itemIdsInTable: () => ['ID', 'ID2'],
        itemIdsOnPage: ['ID'],
      })
    );

    // eslint-disable-next-line testing-library/no-node-access
    expect(result.current.toolbarProps.bulkSelect.toggleProps.children).toEqual(
      ['1 selected']
    );
  });
});
