import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook to execute a query function with parameters and optional skip condition
 *
 * @typedef {Object} Options
 * @property {Array} [params] - An array of parameters for the query function.
 * @property {boolean} [skip=false] - A boolean flag to skip the execution of the query function.
 *
 *
 * @param {Function} fn - Function to execute
 * @param {Options} options - Includes options like params and skip
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

  useEffect(() => {
    if (!skip) refetch();
  }, [JSON.stringify(paramsRef.current)]);

  return { data, error, loading, refetch };
};

export default useQuery;
