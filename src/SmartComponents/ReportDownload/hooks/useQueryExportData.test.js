import { renderHook } from '@testing-library/react-hooks';
import { useApolloClient } from '@apollo/client';
import apolloQueryMock from '../__mocks__/apolloQueryMock';
import { DEFAULT_EXPORT_SETTINGS } from '../constants';
import useQueryExportData from './useQueryExportData';

jest.mock('@apollo/client');

const reduceToCounts = (exportData) =>
  Object.keys(exportData).reduce((acc, entry) => {
    acc[entry] = exportData[entry].length;
    return acc;
  }, {});

describe('useQueryExportData', () => {
  const profile = { id: 'TEST_ID', name: 'TEST_PROFILE', totalHostCount: 1000 };

  beforeEach(() => {
    useApolloClient.mockImplementation(() => ({
      query: apolloQueryMock,
    }));
  });

  it('returns a query function', async () => {
    const { result } = renderHook(() =>
      useQueryExportData(DEFAULT_EXPORT_SETTINGS, profile)
    );
    expect(result.current).toMatchSnapshot();
    expect(reduceToCounts(await result.current())).toMatchSnapshot();
  });

  describe('queryExportData', () => {
    const onComplete = jest.fn();
    const onError = jest.fn();

    afterEach(() => {
      onComplete.mockReset();
      onError.mockReset();
    });

    it('returns data', async () => {
      const { result } = renderHook(() =>
        useQueryExportData(DEFAULT_EXPORT_SETTINGS, profile, {
          onComplete,
          onError,
        })
      );

      expect(reduceToCounts(await result.current())).toMatchSnapshot();
      expect(onComplete).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    it('returns catches errors', async () => {
      useApolloClient.mockImplementation(() => ({
        query: async () => {
          throw 'Error';
        },
      }));
      const { result } = renderHook(() =>
        useQueryExportData(DEFAULT_EXPORT_SETTINGS, profile, {
          onComplete,
          onError,
        })
      );

      expect(reduceToCounts(await result.current())).toMatchSnapshot();
      expect(onComplete).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
    });
  });
});
