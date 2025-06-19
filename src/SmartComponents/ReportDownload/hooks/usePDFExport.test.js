import { renderHook } from '@testing-library/react';
import { DEFAULT_EXPORT_SETTINGS } from '../constants';
import usePDFBuilder from './usePDFBuilder';
import useSupportedSsgFinder from './useSupportedSsgFinder';
import useQueryExportData from './useQueryExportData';

jest.mock('Utilities/Dispatcher');

jest.mock('./useQueryExportData', () => jest.fn());
jest.mock('./usePDFBuilder', () => jest.fn());
jest.mock('./useSupportedSsgFinder', () => jest.fn());

usePDFBuilder.mockImplementation(() => async (data) => data);
useSupportedSsgFinder.mockImplementation(() => async () => []);
useQueryExportData.mockImplementation(() => async () => [
  { nonCompliantSystemCount: 2 },
]);

import usePDFExport from './usePDFExport';

describe('usePDFExport', () => {
  it('returns a export function', () => {
    const {
      result: { current: exportData },
    } = renderHook(() => usePDFExport(DEFAULT_EXPORT_SETTINGS, {}));

    expect(typeof exportData).toBe('function');
  });

  describe('exportData', () => {
    it('returns a export data', async () => {
      const {
        result: { current: exportData },
      } = renderHook(() => usePDFExport(DEFAULT_EXPORT_SETTINGS, {}));
      const result = await exportData();

      expect(result[0].nonCompliantSystemCount).toBe(2);
    });

    it('returns a export data with different settings', async () => {
      const {
        result: { current: exportData },
      } = renderHook(() =>
        usePDFExport(
          {
            ...DEFAULT_EXPORT_SETTINGS,
            compliantSystems: true,
            unsupportedSystems: false,
            userNotes: 'NOTE',
          },
          {},
        ),
      );
      const result = await exportData();

      expect(result[0].nonCompliantSystemCount).toBe(2);
    });
  });
});
