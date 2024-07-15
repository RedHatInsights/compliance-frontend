import { useEffect, useState } from 'react';

/**
 * Custom hook to execute a query function with parameters and optional skip condition
 *
 * @param {Function} fn - Function to execute
 * @param {Array} [params] - An array of parameters for the query function.
 * @param {boolean} [skip=false] - A boolean flag to skip the execution of the query function.
 *
 * @example
 * // Query is skipped if conditions are met
 * const query = useQuery(apiInstance.systems, ["param1", "param2"], number > 5)
 *
 * @example
 * const query = useQuery(apiInstance.systems)
 *
 * @example
 * const query = useQuery(apiInstance.system, ["id"])
 */
const useQuery = (fn, params = [], skip = false) => {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const refetch = () => {
    callQuery(fn, params);
  };

  const callQuery = async (fn, params) => {
    setLoading(true);
    try {
      const data = await fn(...params);
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
  };

  useEffect(() => {
    if (!skip) refetch();
  }, [JSON.stringify(params)]);

  return { data, error, loading, refetch };
};

export default useQuery;
