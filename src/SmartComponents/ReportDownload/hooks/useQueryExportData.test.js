import { renderHook } from '@testing-library/react';
import { useApolloClient } from '@apollo/client';
import apolloQueryMock from '../__mocks__/apolloQueryMock';
import { DEFAULT_EXPORT_SETTINGS } from '../constants';
import useQueryExportData from './useQueryExportData';

jest.mock('@apollo/client');

describe('useQueryExportData', () => {
  const profile = { id: 'TEST_ID', name: 'TEST_PROFILE', totalHostCount: 3 };

  beforeEach(() => {
    useApolloClient.mockImplementation(() => ({
      query: apolloQueryMock,
    }));
  });

  it('returns a query function', async () => {
    const {
      result: { current: queryExportData },
    } = renderHook(() => useQueryExportData(DEFAULT_EXPORT_SETTINGS, profile));
    expect(typeof queryExportData).toBe('function');
  });

  describe('queryExportData', () => {
    const onComplete = jest.fn();
    const onError = jest.fn();

    afterEach(() => {
      onComplete.mockReset();
      onError.mockReset();
    });

    it('returns data', async () => {
      const {
        result: { current: queryExportData },
      } = renderHook(() =>
        useQueryExportData(DEFAULT_EXPORT_SETTINGS, profile, {
          onComplete,
          onError,
        })
      );
      const result = await queryExportData();

      expect(result.nonCompliantSystemCount).toBe(2);
      expect(onComplete).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    it('returns catches errors', async () => {
      useApolloClient.mockImplementation(() => ({
        query: async () => {
          throw 'Error';
        },
      }));
      const {
        result: { current: queryExportData },
      } = renderHook(() =>
        useQueryExportData(DEFAULT_EXPORT_SETTINGS, profile, {
          onComplete,
          onError,
        })
      );

      await queryExportData();

      expect(onComplete).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
    });
  });
});
