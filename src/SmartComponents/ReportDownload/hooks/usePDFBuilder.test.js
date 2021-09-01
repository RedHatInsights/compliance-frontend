import { renderHook } from '@testing-library/react-hooks';
import usePDFBuilder from './usePDFBuilder';

describe('usePDFBuilder', () => {
  it('returns a build pages function', () => {
    const { result } = renderHook(() => usePDFBuilder());
    expect(result.current).toMatchSnapshot();
  });

  describe('buildPages', () => {
    it('returns a query function', async () => {
      const { result } = renderHook(() => usePDFBuilder());
      expect(await result.current({})).toMatchSnapshot();
    });
  });
});
