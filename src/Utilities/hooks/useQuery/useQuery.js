import { useCallback, useRef, useState } from 'react';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';
import debounce from '@redhat-cloud-services/frontend-components-utilities/debounce';

/**
 *
 *  @typedef {object} useQueryReturn
 *  @property {any}      [data]    Data loaded from the response of the request
 *  @property {Error}    [error]   An error if the request failed
 *  @property {boolean}  [loading] Boolean of wether or not data is being requested
 *  @property {Function} [refetch] A callback function to re-trigger a request
 *
 */

/**
 * Custom hook to execute a query function with parameters and optional skip condition
 *
 *  @param   {Function}       fn               Function to execute
 *  @param   {object}         [options]        Includes options like params and skip
 *  @param   {Array}          [options.params] Parameters passed to the request to make
 *  @param   {boolean}        [options.skip]   Wether or not to skip the request
 *
 *  @returns {useQueryReturn}
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
  const { params = [], skip = false, debounced = true } = options;
  const mounted = useRef(true);
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const debouncedFn = debounce(fn, 50);

  const fetchFn = useCallback(
    async (fn, params) => {
      if (!loading) {
        setLoading(true);
        try {
          const data = debounced
            ? await debouncedFn(...params)
            : await fn(...params);

          if (mounted.current) {
            setData(data?.data || data);
            setLoading(false);
          }

          return data?.data || data;
        } catch (e) {
          console.log(e);
          setError(e);
          setLoading(false);
        }
      }
    },
    [loading, debounced, debouncedFn]
  );

  const fetch = useCallback((params) => fetchFn(fn, params), [fn, fetchFn]);
  const refetch = useCallback(() => fetchFn(fn, params), [fetchFn, fn, params]);

  useDeepCompareEffectNoCheck(() => {
    mounted.current = true;
    !skip && refetch();

    return () => {
      setLoading(false);
      mounted.current = false;
    };
  }, [skip, params, typeof refetch !== 'undefined']);

  return { data, error, loading: loading, fetch, refetch };
};

export default useQuery;
