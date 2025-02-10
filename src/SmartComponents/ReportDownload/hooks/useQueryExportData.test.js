import { renderHook } from '@testing-library/react';
import { DEFAULT_EXPORT_SETTINGS } from '../constants';
import useQueryExportData from './useQueryExportData';
import {
  compliantSystems,
  nonCompliantSystems,
  unsupportedSystems,
} from '../../../__factories__/testResults';
import { useSystemsFetch } from './apiQueryHooks';
import systemsFactory from '../../../__factories__/systemsRest';

jest.mock('./apiQueryHooks', () => ({
  ...jest.requireActual('./apiQueryHooks'),
  useSystemsFetch: jest.fn(),
  useFetchFailedRules: () => () => Promise.resolve([]),
}));

describe('useQueryExportData', () => {
  const profile = { id: 'TEST_ID', name: 'TEST_PROFILE', totalHostCount: 3 };

  it('returns a query function', async () => {
    const {
      result: { current: queryExportData },
    } = renderHook(() => useQueryExportData(DEFAULT_EXPORT_SETTINGS, profile));
    expect(typeof queryExportData).toBe('function');
  });

  describe('queryExportData', () => {
    const onComplete = jest.fn();
    const onError = jest.fn();

    useSystemsFetch.mockImplementation(
      () => () =>
        Promise.resolve([
          compliantSystems.buildList(2),
          nonCompliantSystems.buildList(2),
          unsupportedSystems.buildList(2),
          systemsFactory.buildList(2),
        ])
    );

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
      useSystemsFetch.mockImplementation(() => () => Promise.reject());
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
