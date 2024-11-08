import { useEffect, useState } from 'react';
import { apiInstance } from '@/Utilities/hooks/useQuery';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import useFetchBatched from '@redhat-cloud-services/frontend-components-utilities/useFetchBatched';
import map from 'lodash/map';
import { calculateOffset } from '@/Utilities/helpers';

const fetchCallback =
  (policyId, tailoringId) =>
  (_filter, { page, per_page }) =>
    apiInstance.tailoringRules(
      policyId,
      tailoringId,
      null,
      per_page,
      calculateOffset(page, per_page)
    );

const fetchPromises = (tailoringIds, policyId, fetchBatched) =>
  tailoringIds.map(async (tailoringId) => {
    try {
      const fetchTailoringRules = fetchCallback(policyId, tailoringId);

      const { data: { meta: { total } = {} } = {} } = await fetchTailoringRules(
        null,
        { page: 1, per_page: 1 }
      );

      // If no rules, return an empty array
      if (!total) return [];

      // Fetch all rules in batches, flat-mapping the result to retrieve data
      const tailoringRules = await fetchBatched(
        fetchTailoringRules,
        total,
        {},
        20
      );
      return tailoringRules
        .flatMap((rule) => rule.data.data)
        .map((rule) => rule.id);
    } catch (error) {
      console.error(
        `Error fetching rules for tailoringId ${tailoringId}:`,
        error
      );
      return [];
    }
  });

const fetchTailoringRules = async (
  policyId,
  tailoringIds,
  fetchBatched,
  setAssignedRuleIds
) => {
  try {
    const promisesResult = fetchPromises(tailoringIds, policyId, fetchBatched);

    setAssignedRuleIds((await Promise.all(promisesResult)).flat());
  } catch (error) {
    console.error('Error fetching tailoring rule IDs:', error);
    setAssignedRuleIds([]); // Fallback to empty array in case of a top-level error
  }
};

const useAssignedRules = (policyId) => {
  const { data, loading } = useTailorings({
    params: [policyId],
  });
  const { fetchBatched } = useFetchBatched();
  const [assignedRuleIds, setAssignedRuleIds] = useState(null); // We want to explicitly set this to null, so that bulk select properly sets what is preselected items

  useEffect(() => {
    if (!loading && data.length) {
      const nonCanonicalTailorings = data.filter(
        (tailoring) => tailoring.os_minor_version
      );

      fetchTailoringRules(
        policyId,
        map(nonCanonicalTailorings, 'id'),
        fetchBatched,
        setAssignedRuleIds
      );
    }
  }, [loading, data, policyId]); //TODO: fetchBatched is not stable. Causes unneccessary hook triggers. Wrap it with useCallback.

  return { assignedRuleIds, assignedRulesLoading: loading };
};

export default useAssignedRules;
