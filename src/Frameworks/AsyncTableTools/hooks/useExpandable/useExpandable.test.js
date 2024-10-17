import { renderHook } from '@testing-library/react';
import { act } from '@testing-library/react';
import { DEFAULT_RENDER_OPTIONS } from '../../utils/testHelpers';

import useExpandable from './useExpandable';

const ExampleDetailsRow = (item) => {
  return `DETAILS for ${item.name}`;
};

const row = {
  itemId: 'test-id',
};

describe('useExpandable', () => {
  const defaultOptions = {
    detailsComponent: ExampleDetailsRow,
  };

  it('returns an expandable configuration', () => {
    const { result } = renderHook(
      () => useExpandable(defaultOptions),
      DEFAULT_RENDER_OPTIONS
    );

    expect(result.current).toEqual({
      openItems: [],
      openItem: expect.any(Function),
      tableProps: {
        onCollapse: expect.any(Function),
      },
      tableView: {
        onCollapse: expect.any(Function),
        openItems: [],
      },
    });
  });

  it('should handle opening a single row', async () => {
    const itemId = 'test-id';
    const { result } = renderHook(
      () => useExpandable(defaultOptions),
      DEFAULT_RENDER_OPTIONS
    );

    act(() => {
      result.current.tableProps.onCollapse(undefined, undefined, undefined, {
        itemId,
      });
    });

    const openedRow = result.current.openItem(row, [], 0);

    expect(openedRow).toEqual([
      {
        isOpen: true,
        itemId,
      },
      {
        cells: [
          {
            title: expect.anything(), //non-rendered ExampleDetailsRow
          },
        ],
        fullWidth: true,
        parent: 0,
      },
    ]);
  });

  it('should expand & collapse a row', () => {
    const { result } = renderHook(
      () => useExpandable(defaultOptions),
      DEFAULT_RENDER_OPTIONS
    );

    //expand
    act(() => {
      result.current.tableProps.onCollapse(null, 0, true, {
        itemId: 'test-id',
      });
    });

    expect(result.current.openItems).toEqual(['test-id']);

    // collapse
    act(() => {
      result.current.tableProps.onCollapse(null, 0, false, {
        itemId: 'test-id',
      });
    });

    expect(result.current.openItems).toEqual([]);
  });
});
