import { act, renderHook } from '@testing-library/react';
import withExport from './withExport';
import items from '../../../../Utilities/hooks/useTableTools/__fixtures__/items';
import columns from '../../../../Utilities/hooks/useTableTools/__fixtures__/columns';

const exampleItems = items(25);

describe('withExport', () => {
  const exporter = jest.fn(() => Promise.resolve(exampleItems));
  const defaultOptions = {
    exporter,
    columns,
  };

  it('returns an export config toolbar config', () => {
    const { result } = renderHook(() => withExport(defaultOptions));
    expect(result.current.toolbarProps.exportConfig).toBeDefined();
    expect(result.current).toEqual({
      toolbarProps: {
        exportConfig: {
          isDisabled: false,
          onSelect: expect.any(Function),
        },
      },
    });
  });

  it('returns an export config toolbar config with disabled true', () => {
    const { result } = renderHook(() =>
      withExport({
        ...defaultOptions,
        isDisabled: true,
      })
    );
    expect(result.current.toolbarProps.exportConfig.isDisabled).toBe(true);
  });

  it('calls the exporter via onSelect', () => {
    const { result } = renderHook(() => withExport(defaultOptions));

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
