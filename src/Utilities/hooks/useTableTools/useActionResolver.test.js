import { renderHook } from '@testing-library/react';
import { useActionResolverWithItems } from './useActionResolver';
import items from './__fixtures__/items';

describe('useActionResolverWithItems', () => {
  it('returns actionResolver', () => {
    const { result } = renderHook(() =>
      useActionResolverWithItems({
        items: items(5),
        actionResolver: () => true,
      })
    );

    expect(result.current).toHaveProperty('tableProps');
  });

  it('returns empty object with no items', () => {
    const { result } = renderHook(() =>
      useActionResolverWithItems({
        items: [],
        actionResolver: () => true,
      })
    );

    expect(result.current).toEqual({});
  });
});
