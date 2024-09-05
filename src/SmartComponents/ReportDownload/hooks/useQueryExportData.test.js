import { renderHook } from '@testing-library/react';
import { useApolloClient } from '@apollo/client';
import apolloQueryMock from '../__mocks__/apolloQueryMock';
import { DEFAULT_EXPORT_SETTINGS } from '../constants';
import useQueryExportData from './useQueryExportData';
import {
  compliantSystems,
  nonCompliantSystems,
  unsupportedSystems,
} from '../../../__factories__/testResults';
import { useSystemsFetchRest } from './apiQueryHooks';
import systemsFactory from '../../../__factories__/systemsRest';
import useAPIV2FeatureFlag from '../../../Utilities/hooks/useAPIV2FeatureFlag';

jest.mock('@/Utilities/hooks/useAPIV2FeatureFlag');
jest.mock('@apollo/client');
jest.mock('./apiQueryHooks', () => ({
  ...jest.requireActual('./apiQueryHooks'),
  useSystemsFetchRest: jest.fn(),
  useFetchFailedRulesRest: () => () => Promise.resolve([]),
}));

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

  describe('queryExportData GraphQL', () => {
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

  describe('queryExportData REST', () => {
    const onComplete = jest.fn();
    const onError = jest.fn();

    beforeEach(() => {
      useAPIV2FeatureFlag.mockImplementation(() => true);
    });

    useSystemsFetchRest.mockImplementation(
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
      useSystemsFetchRest.mockImplementation(() => () => Promise.reject());
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
