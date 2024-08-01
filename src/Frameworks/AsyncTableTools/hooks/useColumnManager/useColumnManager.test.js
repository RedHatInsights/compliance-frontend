import { renderHook, act } from '@testing-library/react';
import columns from 'Utilities/hooks/useTableTools/__fixtures__/columns';
import useColumnManager from './useColumnManager';

describe('useColumnManager', () => {
  const defaultArguments = [columns, { manageColumns: true }];

  it('returns just columns if not enabled', () => {
    const { result } = renderHook(() => useColumnManager(columns));
    expect(result.current.columns).toBeDefined();
    expect(result.current.ColumnManager).not.toBeDefined();
  });

  it('returns a ColumnManager if enabled', () => {
    const { result } = renderHook(() => useColumnManager(...defaultArguments));
    expect(result.current.ColumnManager).toBeDefined();
  });

  it('applies columns', () => {
    const { result } = renderHook(() => useColumnManager(...defaultArguments));
    const columnsToSelect = result.current.columns.filter(
      ({ key }) => key === 'desc'
    );

    act(() => {
      result.current.applyColumns(columnsToSelect);
    });

    expect(result.current.columns).toEqual(columnsToSelect);
  });
});
