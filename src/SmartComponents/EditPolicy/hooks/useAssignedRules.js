import { useCallback, useEffect, useState } from 'react';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import useTailoringRules from '../../../Utilities/hooks/api/useTailoringRules';
import useFetchTotalBatched from '../../../Utilities/hooks/useFetchTotalBatched';

const useAssignedRules = (policyId) => {
  const [assignedRuleIds, setAssignedRuleIds] = useState(null); // we want to explicitly set this to null, so that bulk select properly sets what is preselected items
  const [assignedRuleIdsLoading, setAssignedRuleIdsLoading] = useState(true);

  const { data: tailoringsData, loading: tailoringsLoading } = useTailorings({
    params: [policyId],
  });
  const { fetch: fetchTailoringRules } = useTailoringRules({ skip: true });

  const fetchBatched = useCallback(
    async (offset, limit, { policyId, tailoringId }) =>
      fetchTailoringRules(
        [
          policyId,
          tailoringId,
          undefined,
          limit,
          offset,
          true, // fetch IDs only
        ],
        false
      ),
    [fetchTailoringRules]
  );

  const { fetch: fetchTailoringRulesBatched } = useFetchTotalBatched(
    fetchBatched,
    {
      batchSize: 60,
      skip: true,
    }
  );

  useEffect(() => {
    const fillTailoringRules = async () => {
      let rules = {};

      const nonCanonicalTailorings = tailoringsData.data.filter(
        ({ os_minor_version }) => os_minor_version !== null
      );

      for (const tailoring of nonCanonicalTailorings) {
        const receivedTailoringRules = await fetchTailoringRulesBatched({
          // TODO: investigate why it's not stable with the dev server
          policyId,
          tailoringId: tailoring.id,
        });

        rules[tailoring.os_minor_version] = receivedTailoringRules
          .flat()
          .map(({ id }) => id);
      }
      setAssignedRuleIds(rules);
      setAssignedRuleIdsLoading(false);
    };

    if (tailoringsLoading === false && tailoringsData !== undefined) {
      fillTailoringRules();
    }
  }, [fetchTailoringRulesBatched, policyId, tailoringsData, tailoringsLoading]);

  return {
    assignedRuleIds,
    assignedRulesLoading: assignedRuleIdsLoading,
  };
};

export default useAssignedRules;
