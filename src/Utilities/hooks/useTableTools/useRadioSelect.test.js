import { renderHook } from '@testing-library/react';
import { useRadioSelectWithItems } from './useRadioSelect';
import items from './__fixtures__/items';

describe('useRadioSelectWithItems', () => {
  it('returns a radio select configuration', () => {
    const { result } = renderHook(() =>
      useRadioSelectWithItems({
        items: items(5),
        onRadioSelect: () => true,
      })
    );

    expect(result.current).toHaveProperty('tableProps');
  });

  it('returns empty object with no items', () => {
    const { result } = renderHook(() =>
      useRadioSelectWithItems({
        items: [],
        onRadioSelect: () => true,
      })
    );

    expect(result.current).toEqual({});
  });
});
