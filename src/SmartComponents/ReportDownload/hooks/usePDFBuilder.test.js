import { renderHook } from '@testing-library/react';
import usePDFBuilder from './usePDFBuilder';

import ReportPDF from '../Components/ReportPDF';
jest.mock('../Components/ReportPDF', () => jest.fn());
ReportPDF.mockImplementation(() => <div>PDF</div>);

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
