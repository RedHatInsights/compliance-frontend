import { renderHook, act } from '@testing-library/react';
import { Name } from '../../Columns';
import useComplianceApi from 'Utilities/hooks/useComplianceApi';
import TestWrapper from 'Utilities/TestWrapper';

import useSystemsQueries from './useSystemsQueries';

jest.mock('@/Frameworks/AsyncTableTools/hooks/useTableState');
jest.mock('Utilities/hooks/useComplianceApi');

const columns = [Name];

describe('useSystemsQueries', () => {
  const apiMock = jest.fn(() => ({
    data: {
      data: [],
      meta: {
        total: 0,
      },
    },
  }));

  const defaultQuerieOptions = {
    apiEndpoint: 'systems',
    columns,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useComplianceApi.mockReturnValue(apiMock);
  });

  it('returns a fetchSystems and batched function', async () => {
    const { result } = renderHook(
      () => useSystemsQueries({ ...defaultQuerieOptions }),
      { wrapper: TestWrapper },
    );

    expect(result.current.fetchSystems).toBeDefined();
    expect(result.current.fetchSystemsBatched).toBeDefined();
  });

  describe('fetchSystems', () => {
    it('calls query fetch function when fetchSystems called', async () => {
      const { result } = renderHook(
        () => useSystemsQueries({ ...defaultQuerieOptions }),
        { wrapper: TestWrapper },
      );

      await result.current.fetchSystems();

      expect(apiMock).toHaveBeenCalled();
    });

    it('passes on params', async () => {
      const testParams = {
        page: 1,
        per_page: 10,
        filters: { hostnameOrId: 'test-id' },
        sortBy: { key: 'name', direction: 'asc' },
      };
      const { result } = renderHook(
        () => useSystemsQueries({ ...defaultQuerieOptions }),
        { wrapper: TestWrapper },
      );

      await act(async () => await result.current.fetchSystems(testParams));

      expect(apiMock).toHaveBeenCalledWith(
        undefined,
        undefined,
        10,
        0,
        undefined,
        'display_name:asc',
        'display_name ~ "test-id"',
      );
    });

    it('passes on filters in params and prepends the defaultFilter', async () => {
      const testParams = { filters: { hostnameOrId: 'test' } };
      const { result } = renderHook(
        () =>
          useSystemsQueries({
            ...defaultQuerieOptions,
            defaultFilter: 'policyId = "testId"',
          }),
        { wrapper: TestWrapper },
      );

      await act(async () => await result.current.fetchSystems(testParams));

      expect(apiMock).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        '(policyId = "testId") AND (display_name ~ "test")',
      );
    });
  });

  // TODO Add tests for fetchSystemsBatched
  // TODO Add tests for systemsExporter
  // TODO Add tests for fetchOperatingSystemsAsOsObjects
});
