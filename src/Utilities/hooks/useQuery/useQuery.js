import { useCallback, useEffect, useRef, useState } from 'react';
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
const useQuery = (fn, { params = [], skip = false } = {}) => {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const fnRef = useRef(fn);
  const paramsRef = useRef(params);

  fnRef.current = fn;
  paramsRef.current = params;

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fnRef.current(...paramsRef.current);
      if (data?.data) {
        setData(data.data);
      } else {
        setData(data);
      }
    } catch (e) {
      console.log(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [fnRef, paramsRef]);

  const debouncedRefetch = useCallback(debounce(refetch, 200), []);

  useEffect(() => {
    if (!skip) debouncedRefetch();
  }, [JSON.stringify(paramsRef.current)]);

  return { data, error, loading, refetch };
};

export default useQuery;
