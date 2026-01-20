import { renderHook, waitFor } from '@testing-library/react';
import { useSerialisedTableState } from 'bastilian-tabletools';
import useComplianceApi from 'Utilities/hooks/useComplianceApi';
import TestWrapper from 'Utilities/TestWrapper';
import useComplianceQuery from './useComplianceQuery';

jest.mock('Utilities/hooks/useComplianceApi');
jest.mock('bastilian-tabletools');

describe('useComplianceQuery', () => {
  const apiMock = jest.fn(() => ({
    data: [],
    meta: { total: 0 },
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    useComplianceApi.mockReturnValue(apiMock);
    useSerialisedTableState.mockReturnValue({});
  });

  it('returns data, loading, error, etc.', async () => {
    const { result } = renderHook(() => useComplianceQuery(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => expect(result.current?.data?.data).toEqual([]));

    expect(result.current).toEqual(
      expect.objectContaining({
        data: { data: [], meta: { total: 0 } },
        error: null,
        loading: false,
        fetch: expect.anything(),
        fetchBatched: expect.anything(),
        refetch: expect.anything(),
      }),
    );
  });

  describe('useTableState: true', () => {
    it('uses the table pagination state', async () => {
      useSerialisedTableState.mockReturnValue({
        pagination: { offset: 0, limit: 10 },
      });

      renderHook(
        () =>
          useComplianceQuery('policies', {
            useTableState: true,
          }),
        {
          wrapper: TestWrapper,
        },
      );

      await waitFor(() =>
        expect(apiMock).toHaveBeenCalledWith(
          expect.objectContaining({
            limit: 10,
            offset: 0,
          }),
        ),
      );
    });

    it('uses the table sorting state', async () => {
      useSerialisedTableState.mockReturnValue({
        sort: 'systems:asc',
      });

      renderHook(
        () =>
          useComplianceQuery('policies', {
            useTableState: true,
          }),
        {
          wrapper: TestWrapper,
        },
      );

      await waitFor(() =>
        expect(apiMock).toHaveBeenCalledWith(
          expect.objectContaining({
            sortBy: 'systems:asc',
          }),
        ),
      );
    });

    it('uses the table filter state', async () => {
      useSerialisedTableState.mockReturnValue({
        filters: 'name = test',
      });

      renderHook(
        () =>
          useComplianceQuery('policies', {
            useTableState: true,
          }),
        {
          wrapper: TestWrapper,
        },
      );

      await waitFor(() =>
        expect(apiMock).toHaveBeenCalledWith(
          expect.objectContaining({
            filter: 'name = test',
          }),
        ),
      );
    });

    it('merges filters from options and state', async () => {
      useSerialisedTableState.mockReturnValue({
        filters: 'name = test',
      });

      renderHook(
        () =>
          useComplianceQuery('policies', {
            useTableState: true,
            params: {
              filter: 'host = 1',
            },
          }),
        {
          wrapper: TestWrapper,
        },
      );

      await waitFor(() =>
        expect(apiMock).toHaveBeenCalledWith(
          expect.objectContaining({
            filter: '(host = 1) AND (name = test)',
          }),
        ),
      );
    });

    it('merges filters from options and state, and fetch call params', async () => {
      useSerialisedTableState.mockReturnValue({
        filters: 'name = test',
      });

      const { result } = renderHook(
        () =>
          useComplianceQuery('policies', {
            useTableState: true,
            skip: true,
            params: {
              filter: 'host = 1',
            },
          }),
        {
          wrapper: TestWrapper,
        },
      );

      await result.current.fetch({ filter: 'host = 2' });

      await waitFor(() =>
        expect(apiMock).toHaveBeenCalledWith(
          expect.objectContaining({
            filter: '((host = 1) AND (name = test)) AND (host = 2)',
          }),
        ),
      );
    });
  });
});
