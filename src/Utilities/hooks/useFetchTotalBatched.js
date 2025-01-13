import { useCallback, useState, useRef } from 'react';
import pAll from 'p-all';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';

const DEFAULT_BATCH_SIZE = 50;

const useFetchTotalBatched = (fetchFn, options = {}) => {
  const {
    batchSize = DEFAULT_BATCH_SIZE,
    skip = false,
    params,
    // TODO Make this obsolete A batched requests result should in the end look the same as any other API request response
    withMeta = false,
  } = options;
  const loading = useRef(false);
  const mounted = useRef(true);
  const [totalResult, setTotalResult] = useState();

  const fetch = useCallback(
    async (fetchParams = {}) => {
      const allParams = {
        ...params,
        ...fetchParams,
      };

      if (!loading.current) {
        loading.current = true;
        const firstPage = await fetchFn(0, batchSize, allParams);
        const total = firstPage?.meta?.total;

        if (total > batchSize) {
          const pages = Math.ceil(total / batchSize) || 1;
          const requests = [...new Array(pages)].map(
            (_, pageIdx) => async () => {
              const page = pageIdx;
              if (page >= 1) {
                const offset = page * batchSize;
                return await fetchFn(offset, batchSize, allParams);
              }
            }
          );
          const results = await pAll(requests, {
            concurrency: 2,
          });

          const allPages = [firstPage, ...results]
            .filter((v) => !!v)
            .flatMap(({ data }) => data);
          const newTotalResult = withMeta
            ? {
                data: allPages,
                meta: firstPage.meta,
              }
            : allPages;
          mounted.current && setTotalResult(newTotalResult);
          loading.current = false;

          return newTotalResult;
        } else {
          const newTotalResult = withMeta ? firstPage : [firstPage.data];
          mounted.current && setTotalResult(newTotalResult);
          loading.current = false;

          return newTotalResult;
        }
      }
    },
    [typeof fetchFn !== 'undefined', batchSize, JSON.stringify(params)]
  );

  useDeepCompareEffectNoCheck(() => {
    mounted.current = true;
    !skip && fetch(params);

    return () => {
      mounted.current = false;
    };
  }, [skip, fetch, params]);

  return {
    loading: typeof totalResult === 'undefined',
    data: totalResult,
    fetch,
  };
};

export default useFetchTotalBatched;
