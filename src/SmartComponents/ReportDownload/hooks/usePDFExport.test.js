import { renderHook } from '@testing-library/react-hooks';
import { useApolloClient } from '@apollo/client';
import apolloQueryMock from '../__mocks__/apolloQueryMock';
import { DEFAULT_EXPORT_SETTINGS } from '../constants';
import usePDFExport from './usePDFExport';

jest.mock('@apollo/client');
jest.mock('Utilities/Dispatcher');

describe('usePDFExport', () => {
  beforeEach(() => {
    useApolloClient.mockImplementation(() => ({
      query: apolloQueryMock,
    }));
  });

  it('returns a export function', () => {
    const { result } = renderHook(() =>
      usePDFExport(DEFAULT_EXPORT_SETTINGS, {})
    );

    expect(result.current).toMatchSnapshot();
  });

  describe('exportData', () => {
    it('returns a export data', async () => {
      const { result } = renderHook(() =>
        usePDFExport(DEFAULT_EXPORT_SETTINGS, {})
      );

      expect(await result.current()).toMatchSnapshot();
    });

    it('returns a export data with different settings', async () => {
      const { result } = renderHook(() =>
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

      expect(await result.current()).toMatchSnapshot();
    });
  });
});
