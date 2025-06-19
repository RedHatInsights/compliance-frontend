import { renderHook } from '@testing-library/react';
import { useFetchSystems } from './useFetchSystems';

describe('useFetchSystems', () => {
  const fetchApi = jest.fn(() =>
    Promise.resolve({ data: { someVar: 'someVal' }, meta: { total: 1 } }),
  );
  const offset = 0;
  const limit = 10;
  const onError = jest.fn();
  const onComplete = jest.fn();

  it('queries with default and passed in params from the request call if passed', () => {
    const requestParams = {
      customVariable: 'testVar',
    };

    const { result } = renderHook(() =>
      useFetchSystems(fetchApi, onComplete, onError),
    );

    result.current(10, 1, requestParams).then(() => {
      expect(fetchApi).toHaveBeenCalledWith(offset, limit, requestParams);
    });
  });

  it('queries with default and passed in params and system fetch arguments', () => {
    const systemFetchArguments = {
      testArgument: 'testFilter',
    };
    const requestParams = {
      customVariable: 'testVar',
    };
    const { result } = renderHook(() =>
      useFetchSystems(fetchApi, onComplete, onError, systemFetchArguments),
    );

    result.current(10, 1, requestParams).then(() => {
      expect(fetchApi).toHaveBeenCalledWith(offset, limit, {
        ...requestParams,
        ...systemFetchArguments,
      });
    });
  });
  it('Propagates the error to OnError if provided', async () => {
    const errorMessage = 'test error';
    const fetchApiWithError = jest.fn(() => Promise.reject(errorMessage));

    const { result } = renderHook(() =>
      useFetchSystems(fetchApiWithError, null, onError),
    );
    await result.current(10, 1);

    expect(onError).toHaveBeenCalledWith(errorMessage);
  });

  it('provides serialised data to onComplete if provided', async () => {
    const { result } = renderHook(() =>
      useFetchSystems(fetchApi, onComplete, onError),
    );
    await result.current(10, 1);

    expect(onComplete).toHaveBeenCalledWith(
      {
        entities: { someVar: 'someVal' },
        meta: { totalCount: 1 },
      },
      { customVariable: 'testVar' },
    );
  });
});
