import { useCallback } from 'react';
import useFetchTotalBatched from '../../../Utilities/hooks/useFetchTotalBatched';
import useRules from '../../../Utilities/hooks/api/useRules';

const useAllSecurityGuideRuleIds = ({ securityGuideId }) => {
  const { fetch } = useRules({
    skip: true,
  });

  const fetchBatched = useCallback(
    async (offset, limit) =>
      await fetch(
        [
          securityGuideId,
          undefined,
          limit,
          offset,
          true, // IDs only
          undefined,
        ],
        false
      ),
    [fetch, securityGuideId]
  );

  const { fetch: fetchAllSecurityGuideRuleIds } = useFetchTotalBatched(
    fetchBatched,
    {
      batchSize: 100,
      skip: true,
    }
  );

  const fetchMapped = async () => {
    const response = await fetchAllSecurityGuideRuleIds();

    return response.map(({ id }) => id);
  };
  return fetchMapped;
};

export default useAllSecurityGuideRuleIds;
