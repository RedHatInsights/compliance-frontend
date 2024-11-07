import { useCallback, useRef, useState } from 'react';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';
import debounce from '@redhat-cloud-services/frontend-components-utilities/debounce';

/**
 *
 *  @typedef {object} useQueryReturn
 *  @property {any}      [data]    Data loaded from the response of the request
 *  @property {Error}    [error]   An error if the request failed
 *  @property {boolean}  [loading] Boolean of wether or not data is being requested
 *  @property {Function} [refetch] A function to re-trigger a request with params coming from the options
 *  @property {Function} [fetch]   A function to make a request on demand. It takes to arguments, a params object or array, and a boolean to control wether or not to set the "data" state or return the results directly. In case the params argument is an array any params from the options will be ignored!
 *
 */

/**
 * Custom hook to execute a query function with parameters and optional skip condition
 *
 *  @param   {Function}       fn               Function to execute
 *  @param   {object}         [options]        Includes options like params and skip
 *  @param   {Array | object} [options.params] Parameters passed to the request to make. If an array is passed it will be spread as arguments!
 *  @param   {boolean}        [options.skip]   Wether or not to skip the request
 *
 *  @returns {useQueryReturn}                  An object containing a data, loading and error state, as well as a fetch and refetch function.
 *
 * @example
 * // Query is skipped if conditions are met
 * const query = useQuery(apiInstance.systems, {params: ["param1", "param2"], skip: number > 5})
 *
 * @example
 * const query = useQuery(apiInstance.systems)
 *
 * @example
 * const query = useQuery(apiInstance.system, {params: ["id"]})
 *
 */
const useQuery = (fn, options = {}) => {
  const { params = {}, skip = false, debounced = true } = options;
  const mounted = useRef(true);
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const debouncedFn = debounce(fn, 50);

  const fetchFn = useCallback(
    async (fn, params, setDataState = true) => {
      if (!loading) {
        setDataState && setLoading(true);
        try {
          const data = await (async (params) => {
            if (Array.isArray(params)) {
              return debounced && setDataState
                ? await debouncedFn(...params)
                : await fn(...params);
            } else {
              return debounced && setDataState
                ? await debouncedFn(params)
                : await fn(params);
            }
          })(params);

          if (setDataState && mounted.current) {
            setData(data?.data || data);
            setLoading(false);
          } else {
            return data?.data || data;
          }
        } catch (e) {
          console.log(e);
          if (setDataState) {
            setError(e);
            setLoading(false);
          } else {
            throw e;
          }
        }
      }
    },
    [loading, debounced, debouncedFn]
  );

  const fetch = useCallback(
    (fetchParams, setDataState) =>
      fetchFn(
        fn,
        !Array.isArray(fetchParams)
          ? {
              ...params,
              ...fetchParams,
            }
          : fetchParams,
        setDataState
      ),
    [fn, fetchFn, params]
  );
  const refetch = useCallback(() => fetchFn(fn, params), [fetchFn, fn, params]);

  useDeepCompareEffectNoCheck(() => {
    mounted.current = true;
    !skip && refetch();

    return () => {
      setLoading(false);
      mounted.current = false;
    };
  }, [skip, params, typeof refetch !== 'undefined']);

  return { data, error, loading, fetch, refetch };
};

export default useQuery;
