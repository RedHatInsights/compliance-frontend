import { renderHook, act } from '@testing-library/react';
import useComplianceApi from 'Utilities/hooks/useComplianceApi';
import useTableToolsQuery from './useTableToolsQuery';
import { useQueryWithUtilities } from 'bastilian-tabletools';
import {
  compileTotalResult,
  defaultCompileResult,
  fetchResult,
  hasRequiredParams,
} from './helpers';

jest.mock('./helpers');

jest.mock('bastilian-tabletools', () => ({
  useQueryWithUtilities: jest.fn(),
}));
jest.mock('Utilities/hooks/useComplianceApi');
jest.mock('use-deep-compare', () => ({
  useDeepCompareMemo: (fn) => fn(),
  useDeepCompareCallback: (fn) => fn,
}));

describe('useTableToolsQuery', () => {
  const endpoint = 'my/endpoint';
  let mockApiEndpoint;

  beforeEach(() => {
    hasRequiredParams.mockClear();
    fetchResult.mockClear();
    useQueryWithUtilities.mockClear();
    useComplianceApi.mockClear();

    mockApiEndpoint = jest.fn().mockResolvedValue({ data: 'api response' });
    useComplianceApi.mockReturnValue(mockApiEndpoint);
    fetchResult.mockResolvedValue('compiled result');
  });

  it('returns the data, loading, and error states from useQueryWithUtilities', () => {
    const mockQueryReturn = {
      result: { data: [1, 2, 3] },
      loading: false,
      error: null,
      refetch: jest.fn(),
    };
    useQueryWithUtilities.mockReturnValue(mockQueryReturn);

    const { result } = renderHook(() => useTableToolsQuery(endpoint));

    expect(useComplianceApi).toHaveBeenCalledWith(endpoint);
    expect(hasRequiredParams).toHaveBeenCalledWith(undefined, {});

    expect(result.current.data).toEqual({ data: [1, 2, 3] });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('disables the query and not checking required params when skip is true', () => {
    renderHook(() => useTableToolsQuery(endpoint, { skip: true }));

    expect(hasRequiredParams).not.toHaveBeenCalled();

    const queryOptions = useQueryWithUtilities.mock.calls[0][0];
    expect(queryOptions.enabled).toBe(false);
  });

  describe('fetchApi function', () => {
    it('calls fetchResult with defaultCompileResult when not fetching onlyTotal', async () => {
      renderHook(() =>
        useTableToolsQuery(endpoint, {
          params: { limit: 10 },
          convertToArray: (p) => [p.search],
        }),
      );

      const { fetchFn } = useQueryWithUtilities.mock.calls[0][0];
      await act(async () => {
        await fetchFn({ limit: 10 });
      });

      expect(fetchResult).toHaveBeenCalledWith(
        mockApiEndpoint,
        { limit: 10 },
        expect.any(Function),
        defaultCompileResult,
      );
    });

    it('calls fetchResult with compileTotalResult and TOTAL_REQUEST_PARAMS when onlyTotal is true', async () => {
      renderHook(() => useTableToolsQuery(endpoint, { onlyTotal: true }));

      const { fetchFn } = useQueryWithUtilities.mock.calls[0][0];
      await act(async () => {
        await fetchFn({ offset: 0 });
      });

      const expectedParams = { offset: 0, limit: 1 };

      expect(fetchResult).toHaveBeenCalledWith(
        mockApiEndpoint,
        expectedParams,
        undefined,
        compileTotalResult,
      );
    });
  });
});
