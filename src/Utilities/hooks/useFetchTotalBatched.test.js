import { renderHook, waitFor } from '@testing-library/react';
import useFetchTotalBatched from './useFetchTotalBatched';

const getMockedfetchFn = (total = 10) =>
  jest.fn(async (offset, limit) => {
    const returnData = {
      data: [...new Array(limit)].map((_, idx) => offset + idx),
      meta: {
        total,
      },
    };
    console.log('Called with', offset, limit, returnData);
    return returnData;
  });

describe('useFetchTotalBatched', () => {
  it('calls a function till the amount of items fills the total', async () => {
    const fetchFn = getMockedfetchFn(100);
    const { result } = renderHook(() => useFetchTotalBatched(fetchFn));

    await waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(2));
    expect(result.current.data.data.length).toEqual(100);
  });

  it('calls a function till the amount of items fills the total', async () => {
    const fetchFn = getMockedfetchFn(50);
    const { result } = renderHook(() => useFetchTotalBatched(fetchFn));

    await waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(1));
    expect(result.current.data.data.length).toEqual(50);
  });

  it('should not call the function right away when skipped', async () => {
    const fetchFn = getMockedfetchFn(100);
    const { result } = renderHook(() =>
      useFetchTotalBatched(fetchFn, { skip: true })
    );

    await waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(0));
    expect(result.current.data).toEqual(undefined);
  });
});
