import { renderHook } from '@testing-library/react-hooks';
import { useApolloClient } from '@apollo/client';
import apolloQueryMock from '../__mocks__/apolloQueryMock';
import { DEFAULT_EXPORT_SETTINGS } from '../constants';
import usePDFBuilder from './usePDFBuilder';
import useSupportedSsgFinder from './useSupportedSsgFinder';

jest.mock('@apollo/client');
jest.mock('Utilities/Dispatcher');

jest.mock('./usePDFBuilder', () => jest.fn());
usePDFBuilder.mockImplementation(() => async () => []);

jest.mock('./useSupportedSsgFinder', () => jest.fn());
useSupportedSsgFinder.mockImplementation(() => async () => []);

import usePDFExport from './usePDFExport';

describe('usePDFExport', () => {
  beforeEach(() => {
    useApolloClient.mockImplementation(() => ({
      query: apolloQueryMock,
    }));
  });

  it('returns a export function', () => {
    const {
      result: { current: exportData },
    } = renderHook(() => usePDFExport(DEFAULT_EXPORT_SETTINGS, {}));

    expect(exportData).toMatchSnapshot();
  });

  describe('exportData', () => {
    it('returns a export data', async () => {
      const {
        result: { current: exportData },
      } = renderHook(() => usePDFExport(DEFAULT_EXPORT_SETTINGS, {}));

      expect(await exportData()).toMatchSnapshot();
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
          {}
        )
      );

      expect(await exportData()).toMatchSnapshot();
    });
  });
});
