import { useCallback, useState, useRef } from 'react';
import pAll from 'p-all';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';

const DEFAULT_BATCH_SIZE = 50;
const CONCURRENT_REQUESTS = 2;

/**
 *  @typedef {object} useFetchTotalBatchedReturn
 *
 *  @property {boolean}  loading Wether or not data is loaded
 *  @property {object}   data    Combined result of all requests
 *  @property {Function} fetch   Function to call the batched requests on demand that additional parameters for all requests
 *
 */

// TODO This hook could be made a feature of either the useComplianceQuery or the useQuery hook directly
/**
 * This hook allows to provide a fetch function that can be called to perform "batched" requests.
 * In short it means it will make as many requests/calls with the function to fill a total.
 * This "total" is taken from the meta.total or the *first* response.
 * Responses or returns of the function are expected to contain at least a "data" and a "meta" property
 * The "data" property must be an array, to be able to merge the results.
 * The "meta" property must at least (in the first response/return) contain the *total* property.
 *
 *  @param   {Function}                   [fetchFn]           An async function that accepts an offset, a limit and a params argument
 *  @param   {object}                     [options]           Hook options
 *  @param   {number}                     [options.batchSize] The limit or items to be requested per request (*Default:* 50)
 *  @param   {boolean}                    [options.skip]      Wether or not to skip (all) requests (*Default:* false)
 *  @param   {object}                     [options.params]    Parameters passed to all calls
 *
 *  @returns {useFetchTotalBatchedReturn}                     An object to use
 *
 *  @category Hooks
 *
 */
const useFetchTotalBatched = (fetchFn, options = {}) => {
  const { batchSize = DEFAULT_BATCH_SIZE, skip = false, params } = options;
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
          const requests = [...new Array(pages)]
            .map((_, pageIdx) => async () => {
              const page = pageIdx;
              if (page >= 1) {
                const offset = page * batchSize;
                return await fetchFn(offset, batchSize, allParams);
              }
            })
            .slice(1);
          const results = await pAll(requests, {
            concurrency: CONCURRENT_REQUESTS,
          });

          const allPages = [
            ...(firstPage?.data || []),
            ...(results?.reduce((acc, { data }) => [...acc, ...data], []) ||
              []),
          ];
          const newTotalResult = {
            data: allPages,
            meta: {
              total: firstPage.meta.total,
            },
          };

          mounted.current && setTotalResult(newTotalResult);
          loading.current = false;

          return newTotalResult;
        } else {
          mounted.current && setTotalResult(firstPage);
          loading.current = false;

          return firstPage;
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
    // TODO this might be redundant... ?
    loading: typeof totalResult === 'undefined',
    // TODO Maybe consider renaming to "result" to avoid confusion with the wrapped "data" of responses.
    data: totalResult,
    fetch,
  };
};

export default useFetchTotalBatched;
