import usePromiseQueue from '@redhat-cloud-services/frontend-components-utilities/usePromiseQueue';
import { apiInstance } from '../useQuery';
import { useEffect, useState } from 'react';

export const useFetchEachPolicyTailoring = (policies) => {
  const { isResolving: loading, resolve } = usePromiseQueue();

  const fetchEachPolicy = async (policies) => {
    return await resolve(
      [...policies].map((policy) => () => {
        return apiInstance.tailorings(policy?.id);
      })
    );
  };

  const [results, setResults] = useState([]);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    const getTailorings = async () => {
      setError(undefined);
      if (policies?.length > 0) {
        try {
          const tailorings = await fetchEachPolicy(policies);
          setResults(tailorings);
        } catch (e) {
          setError(e);
          throw e;
        }
      }
    };
    getTailorings();
  }, [policies]);

  return {
    loading,
    results,
    error,
  };
};
