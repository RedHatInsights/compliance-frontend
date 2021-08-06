import { renderHook } from '@testing-library/react-hooks';
import useTableSort from './useTableSort';
import columns from './__fixtures__/columns';

describe('useTableSort', () => {
  it('returns a table sort configuration', () => {
    const { result } = renderHook(() => useTableSort(columns));
    expect(result).toMatchSnapshot();
  });
});
