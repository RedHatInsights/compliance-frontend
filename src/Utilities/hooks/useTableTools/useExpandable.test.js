import { renderHook, act } from '@testing-library/react-hooks';
import useExpandable from './useExpandable';
import items from './__fixtures__/items';
import columns from './__fixtures__/columns';

const ExampleDetailsRow = (item) => {
  return `DETAILS for ${item.name}`;
};

describe('useExpandable', () => {
  const exampleItems = items(30);
  const defaultOptions = {
    detailsComponent: ExampleDetailsRow,
  };

  it('returns an expandable configuration', () => {
    const { result } = renderHook(() => useExpandable(defaultOptions));

    expect(result).toMatchSnapshot();
  });

  it('returns a transformer to open items', () => {
    const { result } = renderHook(() => useExpandable(defaultOptions));
    const openedItem = result.current.transformer(
      exampleItems[0],
      {
        ...exampleItems[0],
        itemId: 1,
      },
      columns,
      1
    );

    expect(openedItem).toMatchSnapshot();
  });

  it('sets an item as open onCollapse', () => {
    const { result } = renderHook(() => useExpandable(defaultOptions));

    act(() => {
      result.current.tableProps.onCollapse(undefined, undefined, undefined, {
        itemId: 1,
      });
    });

    const openedItem = result.current.transformer(
      exampleItems[0],
      {
        ...exampleItems[0],
        itemId: 1,
      },
      columns,
      1
    );

    expect(openedItem).toMatchSnapshot();
  });

  it('should not return an expandable configuration with treetable active', () => {
    const { result } = renderHook(() =>
      useExpandable({
        ...defaultOptions,
        tableTree: ['item'],
      })
    );

    expect(Object.keys(result.current).length).toEqual(0);
  });
});
