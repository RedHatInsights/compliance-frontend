import { act, renderHook, waitFor } from '@testing-library/react';
import useQuery from './useQuery';

describe('useQuery', () => {
  const apiInstance = {
    systems: jest.fn(),
  };

  beforeEach(() => {
    apiInstance.systems.mockReset();
  });

  it('keeps loading', () => {
    const { result } = renderHook(() =>
      useQuery(() => new Promise(() => {}), [{}])
    );
    expect(result.current).toMatchObject({
      data: undefined,
      error: undefined,
      loading: true,
    });
  });

  it('returns an error', async () => {
    const error = 'this is an error';
    apiInstance.systems.mockRejectedValue(error);
    const { result } = renderHook(() => useQuery(apiInstance.systems, [{}]));

    await waitFor(() => {
      expect(result.current).toMatchObject({
        data: undefined,
        error,
        loading: false,
      });
    });
  });

  it('returns data', async () => {
    const data = {
      hello: 'there',
    };
    apiInstance.systems.mockResolvedValue(data);
    const { result } = renderHook(() => useQuery(apiInstance.systems));

    // Verify query goes to loading state
    expect(result.current).toMatchObject({
      data: undefined,
      error: undefined,
      loading: true,
    });

    await waitFor(() => {
      expect(result.current).toMatchObject({
        data,
        error: undefined,
        loading: false,
      });
    });
  });

  it('calls the API endpoint second time on refetch', async () => {
    const data = {
      hello: 'there',
    };
    const data2 = {
      general: 'kenobi',
    };
    apiInstance.systems.mockResolvedValue(data);
    const { result } = renderHook(() =>
      useQuery(apiInstance.systems, ['123', '456'])
    );

    expect(apiInstance.systems).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(result.current).toMatchObject({
        data,
        error: undefined,
        loading: false,
      });
    });

    // api returns different data now
    apiInstance.systems.mockResolvedValue(data2);
    act(() => {
      result.current.refetch();
    });

    expect(apiInstance.systems).toHaveBeenCalledTimes(2);

    await waitFor(() => {
      expect(result.current).toMatchObject({
        data: data2,
        error: undefined,
        loading: false,
      });
    });
  });

  it('refetches on parameter change', async () => {
    let param = 'xwing';
    let param2 = 'tie';
    const data = {
      hello: 'there',
    };
    const data2 = {
      general: 'kenobi',
    };

    const initialProps = {
      apiInstance: apiInstance.systems,
      param,
    };

    apiInstance.systems.mockResolvedValue(data);
    const { result, rerender } = renderHook(
      ({ param }) => useQuery(apiInstance.systems, [param]),
      {
        initialProps,
      }
    );

    expect(apiInstance.systems).toHaveBeenCalledWith(param);

    await waitFor(() => {
      expect(result.current).toMatchObject({
        data,
        error: undefined,
        loading: false,
      });
    });

    apiInstance.systems.mockResolvedValue(data2);
    // Param changes
    rerender({ param: param2 });

    expect(apiInstance.systems).toHaveBeenLastCalledWith(param2);

    await waitFor(() => {
      expect(result.current).toMatchObject({
        data: data2,
        error: undefined,
        loading: false,
      });
    });
  });

  it('can skip fetching', async () => {
    let param = 'xwing';
    let param2 = 'tie';
    const data = {
      hello: 'there',
    };
    const data2 = {
      general: 'kenobi',
    };
    let skip = false;

    const initialProps = {
      apiInstance: apiInstance.systems,
      param,
      skip,
    };

    apiInstance.systems.mockResolvedValue(data);
    const { result, rerender } = renderHook(
      ({ param, skip }) => useQuery(apiInstance.systems, [param], skip),
      {
        initialProps,
      }
    );

    apiInstance.systems.mockResolvedValue(data2);
    // Param changes and skip = true
    skip = true;
    rerender({ param: param2, skip });

    await waitFor(() => {
      expect(result.current).toMatchObject({
        data,
        error: undefined,
        loading: false,
      });
    });

    // Called only on skip = false
    expect(apiInstance.systems).toHaveBeenCalledTimes(1);
  });
});
