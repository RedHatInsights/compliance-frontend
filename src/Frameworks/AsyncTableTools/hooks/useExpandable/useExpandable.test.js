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
      tableProps: {
        onCollapse: expect.any(Function),
      },
      tableView: {
        onCollapse: expect.any(Function),
        enableExpandingRow: expect.any(Boolean),
        expandRow: expect.any(Function),
        isItemOpen: expect.any(Function),
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
        item: { itemId },
      });
    });

    const openedRow = result.current.tableView.expandRow(
      row,
      [],
      () => 1,
      false
    );

    expect(openedRow).toEqual([
      {
        isOpen: true,
      },
      {
        cells: [
          {
            title: expect.anything(), //non-rendered ExampleDetailsRow
            props: {
              className: 'compliance-rule-details',
            },
          },
        ],
        props: {
          'aria-setsize': 0,
        },
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
        item: { itemId: 'test-id' },
      });
    });

    expect(result.current.tableView.isItemOpen('test-id')).toBe(true);

    // collapse
    act(() => {
      result.current.tableProps.onCollapse(null, 0, false, {
        item: { itemId: 'test-id' },
      });
    });

    expect(result.current.tableView.isItemOpen('test-id')).toBe(false);
  });
});
