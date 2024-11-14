import { renderHook, waitFor } from '@testing-library/react';
import { DEFAULT_RENDER_OPTIONS } from '../../utils/testHelpers';
import items from '../../__fixtures__/items';
import columns from '../../__fixtures__/columns';

import useAsyncTableTools from './useAsyncTableTools';

describe('useAsyncTableTools', () => {
  const exampleItems = items(30).sort((item) => item.name);

  const defaultArguments = [exampleItems, columns, {}];

  it('returns a object with tableProps and toolbarProps even with no items, columns or options passed', () => {
    const { result } = renderHook(
      () => useAsyncTableTools([], []),
      DEFAULT_RENDER_OPTIONS
    );

    expect(result.current.tableProps).toBeDefined();
    expect(result.current.toolbarProps).toBeDefined();
  });

  it('returns a object with tableProps and toolbarProps with items array', () => {
    const { result } = renderHook(
      () => useAsyncTableTools(...defaultArguments),
      DEFAULT_RENDER_OPTIONS
    );

    expect(result.current.tableProps).toBeDefined();
    expect(result.current.toolbarProps).toBeDefined();
  });

  it('returns a object with tableProps and toolbarProps while fetching items async', async () => {
    const asyncFunction = jest.fn(async () => exampleItems);

    renderHook(
      () => useAsyncTableTools(asyncFunction, columns),
      DEFAULT_RENDER_OPTIONS
    );

    await waitFor(() => {
      return expect(asyncFunction).toHaveBeenCalled();
    });
  });
});
