import { renderHook, waitFor, act } from '@testing-library/react';
import useQuery from 'Utilities/hooks/useQuery';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import { Name } from '../../Columns';

import useSystemsQueries from './useSystemsQueries';

jest.mock('Utilities/hooks/useQuery');
jest.mock('@/Frameworks/AsyncTableTools/hooks/useTableState');

const columns = [Name];
const defaultPagination = {
  limit: 10,
  offset: 0,
};

const mockUseTableState = jest.fn(() => ({
  pagination: defaultPagination,
}));

const mockQueryFetch = jest.fn(() => {});

const mockUseQuery = jest.fn(() => {
  return {
    data: [],
    loading: false,
    error: undefined,
    fetch: mockQueryFetch,
  };
});

useQuery.mockImplementation(mockUseQuery);

describe('useSystemsQueries', () => {
  const defaultQuerieOptions = {
    apiEndpoint: 'systems',
    columns,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useSerialisedTableState.mockImplementation(mockUseTableState);
  });

  it('returns a fetchSystems and batched function', async () => {
    const { result } = renderHook(() =>
      useSystemsQueries({ ...defaultQuerieOptions }),
    );

    await waitFor(() =>
      expect(useQuery).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          params: expect.objectContaining({
            ...defaultPagination,
          }),
        }),
      ),
    );

    await waitFor(() =>
      expect(useQuery).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({
          params: expect.objectContaining({
            ...defaultPagination,
          }),
        }),
      ),
    );

    expect(result.current.fetchSystems).toBeDefined();
    expect(result.current.fetchSystemsBatched).toBeDefined();
  });

  describe('fetchSystems', () => {
    it('calls query fetch function when fetchSystems called', async () => {
      const { result } = renderHook(() =>
        useSystemsQueries({ ...defaultQuerieOptions }),
      );

      await act(async () => await result.current.fetchSystems());

      await waitFor(() =>
        expect(mockQueryFetch).toHaveBeenCalledWith({ ...defaultPagination }),
      );
    });

    it('passes on params', async () => {
      const testParams = { id: 'test-id' };
      const { result } = renderHook(() =>
        useSystemsQueries({ ...defaultQuerieOptions }),
      );

      await act(() => result.current.fetchSystems(testParams));

      await waitFor(() =>
        expect(mockQueryFetch).toHaveBeenCalledWith(
          expect.objectContaining(testParams),
        ),
      );
    });

    it('passes on filters in params', async () => {
      const testParams = { filters: { hostnameOrId: 'test' } };
      const { result } = renderHook(() =>
        useSystemsQueries({ ...defaultQuerieOptions }),
      );

      await act(async () => await result.current.fetchSystems(testParams));

      await waitFor(() =>
        expect(mockQueryFetch).toHaveBeenCalledWith({
          filter: 'display_name ~ "test"',
          ...defaultPagination,
        }),
      );
    });

    it('passes on filters in params and prepends the defaultFilter', async () => {
      const testParams = { filters: { hostnameOrId: 'test' } };
      const { result } = renderHook(() =>
        useSystemsQueries({
          ...defaultQuerieOptions,
          defaultFilter: 'policyId = "testId"',
        }),
      );

      await act(async () => await result.current.fetchSystems(testParams));

      await waitFor(() =>
        expect(mockQueryFetch).toHaveBeenCalledWith({
          ...defaultPagination,
          filter: '(display_name ~ "test") AND (policyId = "testId")',
        }),
      );
    });
  });

  describe('fetchSystemsBatched', () => {
    it('calls query fetch function when fetchSystemsBatched called', async () => {
      const { result } = renderHook(() =>
        useSystemsQueries({ ...defaultQuerieOptions }),
      );

      await act(async () => await result.current.fetchSystemsBatched());

      await waitFor(() =>
        expect(mockQueryFetch).toHaveBeenCalledWith(
          expect.objectContaining({
            limit: 50,
            offset: 0,
          }),
        ),
      );
    });
  });
});
