import { useEffect, useState } from 'react';
import usePolicySystems from './usePolicySystems';
import usePolicySystemsOS from './usePolicySystemsOS';

const usePolicyOsVersionCounts = (policyId) => {
  const [counts, setCounts] = useState(null);
  const { fetch: fetchPolicySystemsOS } = usePolicySystemsOS({
    skip: true,
  });
  const { fetch: fetchPolicySystems } = usePolicySystems({
    skip: true,
  });

  useEffect(() => {
    const getCounts = async () => {
      try {
        const newCounts = {};
        const { data: versions } = await fetchPolicySystemsOS(
          { policyId },
          false,
        );

        for (const version of versions) {
          const minor = version.split('.')[1];
          const policySystemsResponse = await fetchPolicySystems(
            {
              policyId,
              limit: 1,
              filter: `(os_minor_version = ${minor})`,
            },
            false,
          );

          newCounts[minor] = policySystemsResponse.meta.total;
        }

        setCounts(newCounts);
      } catch (error) {
        console.error('Error fetching system counts', error);
      }
    };

    getCounts();
    // TODO: investigate why proper dependencies list results in infinite requests
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyId]);

  return counts;
};

export default usePolicyOsVersionCounts;
