import { act, renderHook, waitFor } from '@testing-library/react';
import { useApolloClient } from '@apollo/client';
import {
  useGetEntities,
  useSystemsFilter,
  useSystemsExport,
  useOsMinorVersionFilterRest,
} from './hooks';
import { apiInstance } from '@/Utilities/hooks/useQuery';

jest.mock('Utilities/Dispatcher');
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useApolloClient: jest.fn(() => ({
    query: () => Promise.resolve([]),
  })),
}));
jest.mock('@/Utilities/hooks/useQuery', () => ({
  __esModule: true,
  ...jest.requireActual('@/Utilities/hooks/useQuery'),
  apiInstance: { systemsOS: jest.fn(() => Promise.resolve([])) },
}));
jest.mock('@/Utilities/hooks/useAPIV2FeatureFlag', () => jest.fn(() => false));

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

  it('returns a export with isDisabled true on total 0 ', async () => {
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

    await act(async () => {
      await result.current.onSelect();
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

    await result.current([], {
      per_page: 10,
      orderBy: 'name',
      orderDirection: 'ASC',
    });
    expect(mockFetch).toHaveBeenCalledWith(10, 1, {
      filter: null,
      sortBy: ['nameAttribute:ASC'],
    });
  });

  it('os filter is handled properly', async () => {
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
    await result.current([], {
      per_page: 10,
      orderBy: 'name',
      orderDirection: 'ASC',
      filters: {
        osFilter: {
          'RHEL-8': { 'RHEL-8': null, 'RHEL-8-8.4': true },
        },
      },
    });
    expect(mockFetch).toHaveBeenCalledWith(10, 1, {
      filter: '(os_major_version=8 AND os_minor_version=4)',
      sortBy: ['nameAttribute:ASC'],
    });
  });

  it('group filter is handled properly', async () => {
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
    await result.current([], {
      per_page: 10,
      orderBy: 'name',
      orderDirection: 'ASC',
      filters: {
        hostGroupFilter: ['test-group'],
      },
    });
    expect(mockFetch).toHaveBeenCalledWith(10, 1, {
      filter: '(group_name = "test-group")',
      sortBy: ['nameAttribute:ASC'],
    });
  });

  it('Joins inventory filter OR', async () => {
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
    await result.current([], {
      per_page: 10,
      orderBy: 'name',
      orderDirection: 'ASC',
      filters: {
        hostGroupFilter: ['test-group'],
        osFilter: {
          'RHEL-8': { 'RHEL-8': null, 'RHEL-8-8.4': true },
        },
      },
    });
    expect(mockFetch).toHaveBeenCalledWith(10, 1, {
      filter:
        '(group_name = "test-group") OR (os_major_version=8 AND os_minor_version=4)',
      sortBy: ['nameAttribute:ASC'],
    });
  });
});

describe('useOsMinorVersionFilterRest', () => {
  it('should fetch and prepare an empty filter', async () => {
    const { result } = renderHook(() =>
      useOsMinorVersionFilterRest(true, { filter: 'some-filter' })
    );

    await waitFor(() => expect(result.current).not.toEqual([]));
    expect(result.current[0].items[0]).toEqual(
      expect.objectContaining({
        isDisabled: true,
      })
    );
    expect(result.current[0].items[0].items[0]).toEqual(
      expect.objectContaining({
        label: (
          <div className="ins-c-osfilter__no-os">No OS versions available</div>
        ),
      })
    );
  });

  it.skip('should fetch and prepare the filter with items', async () => {
    apiInstance.systemsOS.mockReturnValue(Promise.resolve(['7.8']));
    const { result } = renderHook(() =>
      useOsMinorVersionFilterRest(true, { filter: 'some-filter' })
    );

    await waitFor(() => expect(result.current).not.toEqual([]));
    await waitFor(() =>
      expect(result.current[0].items[0]).toEqual({
        groupSelectable: true,
        items: [
          {
            label: 'RHEL 7.8',
            value: '8',
          },
        ],
        label: 'RHEL 7',
        value: 7,
      })
    );
  });
});
