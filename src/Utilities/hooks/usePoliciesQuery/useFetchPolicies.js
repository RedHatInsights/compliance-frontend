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

  useEffect(() => {
    const getTailorings = async () => {
      if (policies?.length > 0) {
        const tailorings = await fetchEachPolicy(policies);
        setResults(tailorings);
      }
    };
    getTailorings();
  }, [policies]);

  return {
    loading,
    results,
  };
};
