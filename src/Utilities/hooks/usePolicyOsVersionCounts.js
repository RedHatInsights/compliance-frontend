import { useEffect, useState } from 'react';
import usePolicySystems from './api/usePolicySystems';
import usePolicySystemsOS from './api/usePolicySystemsOS';

const usePolicyOsVersionCounts = (policyId) => {
  const [counts, setCounts] = useState(null);
  const { fetch: fetchPolicySystemsOS } = usePolicySystemsOS({
    params: { policyId },
    skip: true,
  });
  const { fetch: fetchPolicySystems } = usePolicySystems({
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
          const { data: total } = await fetchPolicySystems({
            filter: `(os_minor_version = ${minor})`,
          });

          newCounts[minor] = total;
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
