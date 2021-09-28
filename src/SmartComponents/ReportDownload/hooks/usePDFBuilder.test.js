import { renderHook } from '@testing-library/react-hooks';
import usePDFBuilder from './usePDFBuilder';
jest.mock('../Components/ReportPDF', () => <div>PDF</div>);

describe('usePDFBuilder', () => {
  it('returns a build pages function', () => {
    const {
      result: { current: buildPages },
    } = renderHook(() => usePDFBuilder());
    expect(buildPages).toMatchSnapshot();
  });

  describe('buildPages', () => {
    it('returns and array of pages', async () => {
      const {
        result: { current: buildPages },
      } = renderHook(() => usePDFBuilder());
      expect(await buildPages({})).toMatchSnapshot();
    });
  });
});
