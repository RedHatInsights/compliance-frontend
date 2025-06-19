import { useRef, useState } from 'react';
import { useDeepCompareEffect, useDeepCompareCallback } from 'use-deep-compare';
import { fetchResult } from './helpers';

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
 *  @param   {Function}       fn                       Function to execute
 *  @param   {object}         [options]                Includes options like params and skip
 *  @param   {Array | object} [options.params]         Parameters passed to the request to make. If an array is passed it will be spread as arguments!
 *  @param   {boolean}        [options.convertToArray] A function to use to convert a params object into an arguments array to pass to the fetch function
 *  @param   {boolean}        [options.compileResult]  A function to use to convert the request response
 *  @param   {boolean}        [options.skip]           Wether or not to skip the request
 *
 *  @returns {useQueryReturn}                          An object containing a data, loading and error state, as well as a fetch and refetch function.
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
  // TODO Maybe both convertToArray and compileResult might be more useComplianceQuerys responsibility?
  const { params = {}, skip = false, convertToArray, compileResult } = options;
  const mounted = useRef(true);
  // TODO we do not clear the data before we perform a request
  // This can under certain conditions cause odd behaviour.
  // For example, in tables when paginating, data from one page will be displayed as long as the next page is not loaded.
  // Sometimes this is wanted, but other times this might cause unwanted behaviour. We should be able to control that.
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const fetchFn = useDeepCompareCallback(
    // TODO We should maybe establish the wording "arguments" here
    // This might make make it more clear that these are not request parameters, but function arguments
    async (fn, params, setDataState = true) => {
      if (setDataState) {
        if (!loading) {
          setLoading(true);
          try {
            const result = await fetchResult(
              fn,
              params,
              convertToArray,
              compileResult,
            );

            if (mounted.current) {
              setData(result);
              setLoading(false);
            }
          } catch (e) {
            console.log(e);
            if (mounted.current) {
              setError(e);
              setLoading(false);
            }
          }
        }
      } else {
        try {
          return await fetchResult(fn, params, convertToArray, compileResult);
        } catch (e) {
          console.log(e);
          throw e;
        }
      }
    },
    [loading, convertToArray],
  );

  const fetch = useDeepCompareCallback(
    async (fetchParams) =>
      await fetchFn(
        fn,
        !Array.isArray(fetchParams) && !Array.isArray(params)
          ? {
              ...params,
              ...fetchParams,
            }
          : fetchParams,
        false,
      ),
    [fn, fetchFn, params],
  );
  const refetch = useDeepCompareCallback(
    async () => await fetchFn(fn, params),
    [fetchFn, fn, params],
  );

  useDeepCompareEffect(() => {
    mounted.current = true;
    !skip && refetch();

    return () => {
      setLoading(false);
      mounted.current = false;
    };
  }, [skip, params, typeof refetch !== 'undefined']);

  // TODO We should slowly move query hooks that assign data, to use "result" and then remove "data"
  // We then have the return look like { result, error, loading }, which will be less confusing than having to do data.data
  return { data, result: data, error, loading, fetch, refetch };
};

export default useQuery;
