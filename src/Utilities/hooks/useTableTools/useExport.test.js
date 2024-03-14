import { act, renderHook } from '@testing-library/react';
import columns from './__fixtures__/columns';
import items from './__fixtures__/items';
import useExport, { jsonForItems, csvForItems } from './useExport';

const exampleItems = items(25);

describe('useExport', () => {
  const exporter = jest.fn(() => Promise.resolve(exampleItems));
  const defaultOptions = {
    exporter,
    columns,
  };

  it('returns an export config toolbar config', () => {
    const { result } = renderHook(() => useExport(defaultOptions));
    expect(result.current.toolbarProps.exportConfig).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  it('returns an export config toolbar config', () => {
    const { result } = renderHook(() =>
      useExport({
        ...defaultOptions,
        isDisabled: true,
      })
    );
    expect(result.current.toolbarProps.exportConfig.isDisabled).toBe(true);
  });

  it('calls the exporter via onSelect', () => {
    const { result } = renderHook(() => useExport(defaultOptions));

    act(() => {
      result.current.toolbarProps.exportConfig.onSelect(null, 'csv');
    });

    expect(exporter).toHaveBeenCalled();

    act(() => {
      result.current.toolbarProps.exportConfig.onSelect(null, 'json');
    });

    expect(exporter).toHaveBeenCalled();
  });
});

describe('jsonForItems', () => {
  it('returns an json export of items', () => {
    const result = jsonForItems({
      columns,
      items: exampleItems,
    });

    expect(result).toMatchSnapshot();
  });
});

describe('csvForItems', () => {
  it('returns an csv export of items', () => {
    const result = csvForItems({
      columns,
      items: exampleItems,
    });

    expect(result).toMatchSnapshot();
  });
});
