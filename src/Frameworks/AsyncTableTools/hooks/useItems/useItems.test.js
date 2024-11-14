import { renderHook, waitFor } from '@testing-library/react';
import { DEFAULT_RENDER_OPTIONS } from '../../utils/testHelpers';
import items from '../../__fixtures__/items';

import useItems from './useItems';

describe('useItems', () => {
  const exampleItems = items(30).sort((item) => item.name);

  it('accepts an array as items and sets it as the state directly', async () => {
    const { result } = renderHook(
      () => useItems(exampleItems),
      DEFAULT_RENDER_OPTIONS
    );

    await waitFor(() => expect(result.current.items).toEqual(exampleItems));
    await waitFor(() => expect(result.current.loaded).toEqual(true));
  });

  it('accepts an async function returning an array as items and sets it as the state directly and set loaded to true', async () => {
    const tenItems = exampleItems.slice(0, 10);
    const asyncItems = async () => tenItems;
    const { result } = renderHook(
      () => useItems(asyncItems),
      DEFAULT_RENDER_OPTIONS
    );

    await waitFor(() =>
      expect(result.current).toEqual({ loaded: true, items: tenItems })
    );
  });
});
