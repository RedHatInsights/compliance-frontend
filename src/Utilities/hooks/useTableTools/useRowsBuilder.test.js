import { renderHook } from '@testing-library/react';
import items from './__fixtures__/items';
import columns from './__fixtures__/columns';
import useRowsBuilder from './useRowsBuilder';

describe('useRowsBuilder', () => {
  const exampleItems = items(30);

  it('returns a rows configuration', () => {
    const { result } = renderHook(() => useRowsBuilder(exampleItems, columns));
    expect(result).toMatchSnapshot();
  });
});
