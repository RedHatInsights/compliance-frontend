import { useEffect, useState } from 'react';
import usePolicySystems from './api/usePolicySystems';
import usePolicySystemsOS from './api/usePolicySystemsOS';

const usePolicyOsVersionCounts = (policyId) => {
  const [counts, setCounts] = useState(null);
  const { query: fetchPolicySystemsOS } = usePolicySystemsOS({
    params: { policyId },
    skip: true,
  });
  const { query: fetchPolicySystems } = usePolicySystems({
    params: {
      policyId,
    },
    onlyTotal: true,
    skip: true,
  });

  useEffect(() => {
    const getCounts = async () => {
      try {
        const newCounts = {};
        const { data: versions } = await fetchPolicySystemsOS();

        for (const version of versions) {
          const minor = version.split('.')[1];
          const totalSystemsCount = await fetchPolicySystems({
            filters: `(os_minor_version = ${minor})`,
          });
          newCounts[minor] = totalSystemsCount;
        }

        setCounts(newCounts);
      } catch (error) {
        console.error('Error fetching system counts', error);
      }
    };

    getCounts();
  }, [policyId, fetchPolicySystemsOS, fetchPolicySystems]);

  return counts;
};

export default usePolicyOsVersionCounts;
