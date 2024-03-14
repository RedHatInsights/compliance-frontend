import { renderHook } from '@testing-library/react';
import items from './__fixtures__/items';
import useItemIdentify from './useItemIdentify';

describe('useItemIdentify', () => {
  const exampleItems = items(30);

  it('returns identified items', () => {
    const { result } = renderHook(() => useItemIdentify(exampleItems));
    expect(result.current).toMatchSnapshot();
  });

  it('returns identified items by name', () => {
    const { result } = renderHook(() =>
      useItemIdentify(exampleItems, { identifier: 'name' })
    );
    expect(result.current).toMatchSnapshot();
  });
});
