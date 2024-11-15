import { useCallback, useEffect, useState, useRef } from 'react';
import usePromiseQueue from './usePromiseQueue';

const useFetchTotalBatched = (
  fetchFn,
  { batchSize = 10, skip = false } = {}
) => {
  const mounted = useRef(false);
  const [totalResult, setTotalResult] = useState();
  const { isResolving, resolve } = usePromiseQueue();

  const fetch = useCallback(async () => {
    const firstPage = await fetchFn(0, batchSize);
    const total = firstPage?.meta?.total;

    if (total > batchSize) {
      const pages = Math.ceil(total / batchSize) || 1;

      const results = await resolve(
        [...new Array(pages)].map((_, pageIdx) => async () => {
          const page = pageIdx;
          if (page >= 1) {
            const offset = page * batchSize;

            return await fetchFn(offset, batchSize);
          }
        })
      );
      const allPages = [firstPage, ...results]
        .filter((v) => !!v)
        .flatMap(({ data }) => data);

      mounted.current && setTotalResult(allPages);
      return allPages;
    } else {
      mounted.current && setTotalResult([firstPage.data]);
      return [firstPage.data];
    }
  }, [typeof fetchFn !== 'undefined', resolve, batchSize]);

  useEffect(() => {
    !skip && fetch();
  }, [skip, fetch]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  return {
    loading: isResolving,
    data: totalResult,
    fetch,
  };
};

export default useFetchTotalBatched;
