import { renderHook } from '@testing-library/react';
import { act } from '@testing-library/react';
import useExpandable from './useExpandable';

const ExampleDetailsRow = jest.fn((item) => {
  return `DETAILS for ${item.name}`;
});

describe('useExpandable', () => {
  const defaultOptions = {
    detailsComponent: ExampleDetailsRow,
  };

  it('returns an expandable configuration', () => {
    const { result } = renderHook(() => useExpandable(defaultOptions));

    expect(result.current).toEqual({
      openItem: expect.any(Function),
      openItems: [],
      tableProps: {
        onCollapse: expect.any(Function),
      },
    });
  });

  it('should an expands & shrink  a row', () => {
    const { result } = renderHook(() => useExpandable(defaultOptions));

    //expand
    act(() => {
      result.current.tableProps.onCollapse(null, 0, 'row title', {
        itemId: 'test-id',
      });
    });

    expect(result.current.openItems).toEqual(['test-id']);

    //shrink
    act(() => {
      result.current.tableProps.onCollapse(null, 0, 'row title', {
        itemId: 'test-id',
      });
    });

    expect(result.current.openItems).toEqual([]);
  });
});
