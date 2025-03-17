import { useEffect, useState } from 'react';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import useTailoringRules from '../../../Utilities/hooks/api/useTailoringRules';

const useAssignedRules = (policyId) => {
  const [assignedRuleIds, setAssignedRuleIds] = useState(null); // we want to explicitly set this to null, so that bulk select properly sets what is preselected items
  const [assignedRuleIdsLoading, setAssignedRuleIdsLoading] = useState(true);

  const { data: { data: tailorings } = {}, loading: tailoringsLoading } =
    useTailorings({
      params: { policyId, filter: 'NOT(null? os_minor_version)' },
    });
  const { fetchBatchedQueue: fetchTailoringRules } = useTailoringRules({
    params: { policyId, idsOnly: true },
    skip: true,
  });

  useEffect(() => {
    const fillTailoringRules = async () => {
      const rulesQueue = Object.fromEntries(
        tailorings.map(({ os_minor_version, id: tailoringId }) => [
          os_minor_version,
          { tailoringId },
        ])
      );

      const rules = Object.fromEntries(
        Object.entries(await fetchTailoringRules(rulesQueue)).map(
          ([os_minor_version, { data: rulesData }]) => [
            os_minor_version,
            rulesData.map(({ id }) => id),
          ]
        )
      );

      setAssignedRuleIds(rules);
      setAssignedRuleIdsLoading(false);
    };

    if (tailoringsLoading === false && tailorings !== undefined) {
      fillTailoringRules();
    }
  }, [fetchTailoringRules, tailorings, tailoringsLoading]);

  return {
    assignedRuleIds,
    assignedRulesLoading: assignedRuleIdsLoading,
  };
};

export default useAssignedRules;
