import { useCallback } from 'react';
import useFetchTotalBatched from '../../../Utilities/hooks/useFetchTotalBatched';
import useTailoringRules from '../../../Utilities/hooks/api/useTailoringRules';

const useFetchAllTailoringRuleIds = ({ policyId, tailoringId }) => {
  const { fetch } = useTailoringRules({
    skip: true,
  });

  const fetchBatched = useCallback(
    async (offset, limit) =>
      await fetch(
        [
          policyId,
          tailoringId,
          undefined,
          limit,
          offset,
          true, // IDs only
          undefined,
        ],
        false
      ),
    [fetch, policyId, tailoringId]
  );

  const { fetch: fetchAllTailoringRuleIds } = useFetchTotalBatched(
    fetchBatched,
    {
      batchSize: 100,
      skip: true,
    }
  );

  const fetchMapped = async () => {
    const response = await fetchAllTailoringRuleIds();

    return response.map(({ id }) => id);
  };
  return fetchMapped;
};

export default useFetchAllTailoringRuleIds;
