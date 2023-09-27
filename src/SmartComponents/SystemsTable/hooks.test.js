import { act, renderHook } from '@testing-library/react-hooks';
import { useApolloClient } from '@apollo/client';
import { useGetEntities, useSystemsFilter, useSystemsExport } from './hooks';

jest.mock('Utilities/Dispatcher');
jest.mock('@apollo/client', () => ({
  useApolloClient: jest.fn(() => ({
    query: () => Promise.resolve([]),
  })),
}));

describe('useSystemsFilter', () => {
  it('returns a filter string', () => {
    const { result } = renderHook(() =>
      useSystemsFilter('name = "Name"', true, 'default = "filter"')
    );
    expect(result.current).toEqual(
      '(default = "filter") and (has_test_results = true and name = "Name")'
    );
  });

  it('returns a filter string without default filter', () => {
    const { result } = renderHook(() =>
      useSystemsFilter('name = "Name"', true)
    );
    expect(result.current).toEqual('has_test_results = true and name = "Name"');
  });

  it('returns a filter string without test result filter', () => {
    const { result } = renderHook(() =>
      useSystemsFilter('name = "Name"', false)
    );
    expect(result.current).toEqual('name = "Name"');
  });

  it('returns an empty string without any filter passed and results disabled', () => {
    const { result } = renderHook(() => useSystemsFilter('', false));
    expect(result.current).toEqual('');
  });

  it('returns only the result filter string with only the results filter enabled', () => {
    const { result } = renderHook(() => useSystemsFilter('', true));
    expect(result.current).toEqual('has_test_results = true');
  });
});

describe('useSystemsExport', () => {
  const defaultOptions = {
    columns: [{ name: 'Name' }],
    policyId: 'POLICY ID',
    total: 1,
    fetchArguments: {
      query: 'QUERY',
      filter: '',
      variables: {},
    },
  };

  it('returns a export configuration', () => {
    const { result } = renderHook(() => useSystemsExport(defaultOptions));

    expect(result.current).toMatchSnapshot();
  });

  it('returns a export with isDisabled true on total 0 ', () => {
    const { result } = renderHook(() =>
      useSystemsExport({
        ...defaultOptions,
        total: 0,
      })
    );

    expect(result.current).toMatchSnapshot();
  });

  it('returns a export with isDisabled true on total 0 ', () => {
    const { result } = renderHook(() =>
      useSystemsExport({
        ...defaultOptions,
        selected: [1],
      })
    );

    expect(result.current).toMatchSnapshot();
  });

  it('returns a export with isDisabled true on total 0 ', () => {
    const apolloClient = jest.fn(() => ({
      query: () => Promise.resolve([]),
    }));
    useApolloClient.mockImplementation(apolloClient);

    const { result } = renderHook(() =>
      useSystemsExport({
        ...defaultOptions,
        selected: [1],
      })
    );

    act(() => {
      result.current.onSelect();
    });

    expect(apolloClient).toHaveBeenCalled();
  });
});

describe('useGetEntities', () => {
  const mockFetch = jest.fn(() =>
    Promise.resolve({
      entities: [{ id: 1, name: 'TEST ENTITY NAME' }],
      meta: { totalCount: 0 },
    })
  );

  it('returns a getEntities function', () => {
    const { result } = renderHook(() => useGetEntities(mockFetch));
    expect(result.current).toMatchSnapshot();
  });

  it('the returned function calls mockFetch', async () => {
    const { result } = renderHook(() => useGetEntities(mockFetch));
    // eslint-disable-next-line
    const fetchResult = await result.current([], { per_page: 10, orderBy: 'name', orderDirection: 'ASC' })
    expect(fetchResult).toMatchSnapshot();
    expect(mockFetch).toHaveBeenCalled();
  });

  it('the returned function calls with proper sortBy', async () => {
    const { result } = renderHook(() =>
      useGetEntities(mockFetch, {
        columns: [
          {
            title: 'Name',
            key: 'name',
            sortBy: ['nameAttribute'],
          },
        ],
        selected: [{ id: 1 }],
      })
    );
    // eslint-disable-next-line
    const fetchResult = await result.current([], { per_page: 10, orderBy: 'name', orderDirection: 'ASC' })
    expect(mockFetch).toHaveBeenCalledWith(10, 1, {
      filters: undefined,
      sortBy: ['nameAttribute:ASC'],
    });
  });
});
