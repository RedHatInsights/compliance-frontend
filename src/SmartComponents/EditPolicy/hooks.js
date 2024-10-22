import { useCallback, useState } from 'react';
import { usePolicy } from 'Mutations';
import { dispatchNotification } from 'Utilities/Dispatcher';
import { apiInstance } from '@/Utilities/hooks/useQuery';
import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag';
import usePolicyQuery2 from '@/Utilities/hooks/usePolicyQuery/usePolicyQuery2';
import useSupportedProfiles from '@/Utilities/hooks/useSupportedProfiles/useSupportedProfiles';
import useTailoringsQuery from '../../Utilities/hooks/api/useTailoringsQuery';
import useFetchBatched from '@redhat-cloud-services/frontend-components-utilities/useFetchBatched';
import map from 'lodash/map';

export const useOnSave = (
  policy,
  updatedPolicyHostsAndRules,
  { onSave: onSaveCallback, onError: onErrorCallback } = {}
) => {
  const apiV2Enabled = useAPIV2FeatureFlag();
  const updatePolicyGraphQL = usePolicy();
  const updatePolicy = apiV2Enabled ? updatePolicyV2 : updatePolicyGraphQL;
  const [isSaving, setIsSaving] = useState(false);

  const onSave = useCallback(() => {
    if (isSaving) {
      return Promise.resolve({});
    }

    setIsSaving(true);
    updatePolicy(policy, updatedPolicyHostsAndRules)
      .then((policy) => {
        setIsSaving(false);
        dispatchNotification({
          variant: 'success',
          title: 'Policy updated',
          autoDismiss: true,
        });
        onSaveCallback?.(policy);
      })
      .catch((error) => {
        setIsSaving(false);
        dispatchNotification({
          variant: 'danger',
          title: 'Error updating policy',
          description: error.message,
        });
        onErrorCallback?.();
      });
  }, [isSaving, policy, updatedPolicyHostsAndRules]);

  return [isSaving, onSave];
};

const updatePolicyV2 = async (policy, updatedPolicy) => {
  return await apiInstance.updatePolicy(policy.id, null, {
    description: updatedPolicy?.description,
    business_objective: updatedPolicy?.businessObjective?.title ?? '--',
    compliance_threshold: parseFloat(updatedPolicy?.complianceThreshold),
  });
};

export const useEditPolicyData = (policyId) => {
  const {
    data: { data: policyData } = {},
    error: policyError,
    loading: policyLoading,
  } = usePolicyQuery2({ policyId });

  const {
    data: supportedProfiles,
    error: supportedProfilesError,
    loading: supportedProfilesLoading,
  } = useSupportedProfiles(
    policyData?.os_major_version,
    policyLoading || !policyData?.os_major_version
  );

  const policyProfile = supportedProfiles?.find(
    (profile) => profile.ref_id === policyData.ref_id
  );

  const supportedOsVersions = policyProfile?.os_minor_versions || null;

  return {
    data: {
      ...policyData,
      supportedOsVersions,
    },
    error: policyError || supportedProfilesError,
    loading: policyLoading || supportedProfilesLoading,
  };
};

const fetchCallback =
  (policyId, tailoringId) =>
  (limit = 0, offset = 0) =>
    apiInstance.tailoringRules(policyId, tailoringId, null, limit, offset);

const fetchTailoringRuleIds = async (policyId, tailoringIds, fetchBatched) => {
  const fetchFunction = async (tailoringId) => {
    if (!tailoringId) return []; // exit recursion when all tailorings are iterated.

    const fetchTailoringRules = fetchCallback(policyId, tailoringId);
    const { data: { meta: { total } = {} } = {} } = await fetchTailoringRules(
      1
    );

    if (!total) return []; // no need to make an API call.

    const tailoringRules = await fetchBatched(fetchTailoringRules, total);

    return [
      ...((await fetchFunction(tailoringIds.pop())) || []),
      ...map(tailoringRules, 'id'),
    ];
  };

  const result = await fetchFunction(tailoringIds.pop());
  console.log(result, 'debug: tialoring rule ids');
};

export const usePolicyAssignedRules = (policyId, policy, policyLoading) => {
  const { data, error, loading } = useTailoringsQuery(policyId, policyLoading);
  const { isLoading, fetchBatched } = useFetchBatched();

  // console.log(data, 'debug: tailoring');
  // console.log(policy, 'debug: policy');
  // console.log(policyLoading, !policy || policyLoading, 'debug: policyLoading');

  if (!loading && data) {
    console.log('debug: hello', loading, data);
    fetchTailoringRuleIds(policyId, map(data, 'id'), fetchBatched);
  }
};
