import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook to execute a query function with parameters and optional skip condition
 *
 * @typedef {Object} Options
 * @property {Array} [params] - An array of parameters for the query function.
 * @property {boolean} [skip=false] - A boolean flag to skip the execution of the query function.
 * @property {Object} [serializer=undefined] - Settings to change the structure of the response
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
const useQuery = (
  fn,
  { params = [], skip = false, serializer = undefined } = {}
) => {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const fnRef = useRef(fn);
  const paramsRef = useRef(params);

  fnRef.current = fn;
  paramsRef.current = params;

  /**
   * @param {Object} input
   * @param {Object} settings
   *
   * @example
   * const input = {
   *  id: "123",
   *  deeply: {
   *    nested: "value"
   *  },
   *  ref_id: "ref123"
   * }
   * const settings = {
   *    id: "id",
   *    "deeply.nested": "even.deep.err",
   *    "ref_id": "refId"
   * }
   * res = serialize(input, settings);
   * // res = {
   * //   id: "123",
   * //   even: {
   * //    deep: {
   * //      err: {
   * //        value
   * //      }
   * //    }
   * //   },
   * //   refId: "ref123"
   * // }
   */
  const serialize = (input, settings) => {
    const getValue = (obj, key) => {
      let ref = obj;
      if (key.includes('.')) {
        key.split('.').forEach((element) => {
          ref = ref[element];
        });
      } else {
        ref = ref[key];
      }
      return ref;
    };

    let newObj = {};
    for (const [key, value] of Object.entries(settings)) {
      const finalValue = getValue(input, key);
      if (value.includes('.')) {
        const split = value.split('.');
        let ref = newObj;
        split.forEach((el, index) => {
          if (!Object.prototype.hasOwnProperty.call(ref, el)) {
            ref[el] = index + 1 !== split.length ? {} : finalValue;
          }
          ref = ref[el];
        });
      } else {
        newObj[value] = input[key];
      }
    }
    return newObj;
  };

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fnRef.current(...paramsRef.current);
      const data = serializer ? serialize(res.data, serializer) : res;
      setData(data.data);
    } catch (e) {
      console.log(e);
      setError(e);
    } finally {
      setLoading(undefined);
    }
  }, [fnRef, paramsRef]);

  useEffect(() => {
    if (!skip) refetch();
  }, [JSON.stringify(paramsRef.current)]);

  return { data, error, loading, refetch };
};

export default useQuery;
