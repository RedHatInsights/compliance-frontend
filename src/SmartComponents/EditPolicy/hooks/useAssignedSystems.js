import { useCallback, useEffect, useState } from 'react';
import { calculateOffset } from '../../../Utilities/helpers';
import { apiInstance } from '../../../Utilities/hooks/useQuery';
import useFetchBatched from '@redhat-cloud-services/frontend-components-utilities/useFetchBatched';

const fetchPolicySystems =
  (policyId) =>
  (_filter, { page, per_page }) =>
    apiInstance.policySystems(
      policyId,
      null,
      null,
      per_page,
      calculateOffset(page, per_page),
    );

const useAssignedSystems = (policyId, policy = [], policyLoading) => {
  const { isLoading, fetchBatched } = useFetchBatched();
  const [assignedSystems, setAssignedSystems] = useState([]);

  const fetchAPI = useCallback(async () => {
    const fetchFunction = fetchPolicySystems(policyId);
    const assignedSystems = await fetchBatched(
      fetchFunction,
      policy.total_system_count,
    ).then((systems) => systems.flatMap((system) => system?.data?.data));

    setAssignedSystems(assignedSystems);
  }, [policyId, policy.total_system_count]); //TODO: fetchBatched is not stable. Causes unneccessary hook triggers. Wrap it with useCallback.

  useEffect(() => {
    if (policyId && !policyLoading && policy?.total_system_count) {
      fetchAPI();
    }
  }, [policyLoading, policyId, fetchAPI, policy?.total_system_count]);

  return {
    assignedSystems,
    assignedSystemsLoading: isLoading,
  };
};

export default useAssignedSystems;
