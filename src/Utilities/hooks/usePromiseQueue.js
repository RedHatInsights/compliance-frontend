import { useCallback, useState } from 'react';
import pAll from 'p-all';

const DEFAULT_CONCURRENT_PROMISES = 2;

const usePromiseQueue = (limit = DEFAULT_CONCURRENT_PROMISES) => {
  const [isResolving, setIsResolving] = useState();
  const [promiseResults, setPromiseResults] = useState();

  const resolve = useCallback(
    async (fns, setState = true) => {
      if (setState) {
        setPromiseResults(undefined);
        setIsResolving(true);
      }
      const results = await pAll(fns, {
        concurrency: limit,
      });
      if (setState) {
        setIsResolving(false);
        setPromiseResults(results);
      }
      return results;
    },
    [limit]
  );

  return {
    isResolving,
    results: promiseResults,
    resolve,
  };
};

export default usePromiseQueue;
