import { useCallback, useState } from 'react';
import { usePolicy } from 'Mutations';
import { dispatchNotification } from 'Utilities/Dispatcher';
import { apiInstance } from '@/Utilities/hooks/useQuery';
import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag';

const updatePolicyV2 = async (policyId, updatedPolicy) =>
  apiInstance.updatePolicy(policyId, null, {
    description: updatedPolicy?.description,
    business_objective: updatedPolicy?.businessObjective?.title ?? '--',
    compliance_threshold: parseFloat(updatedPolicy?.complianceThreshold),
  });

const updateAssignedSystems = (policyId, assignedSystems) =>
  apiInstance.assignSystems(policyId, null, { ids: assignedSystems });

const updateAssignedRules = (policyId, tailoringId, assignedSystems) =>
  apiInstance.assignRules(policyId, tailoringId, null, {
    ids: assignedSystems,
  });

const prepareUpdatePromises = (policy, updatedPolicyHostsAndRules) => {
  const {
    hosts,
    tailoringRules,
    description,
    businessObjective,
    complianceThreshold,
  } = updatedPolicyHostsAndRules;
  const policyId = policy.id;
  const updatePromises = [];

  if (hosts) {
    updatePromises.push(updateAssignedSystems(policyId, hosts));
  }

  if (tailoringRules) {
    Object.entries(tailoringRules).forEach(([tailoringId, assignedRules]) => {
      updatePromises.push(
        updateAssignedRules(policyId, tailoringId, assignedRules)
      );
    });
  }

  if (description || businessObjective || complianceThreshold) {
    updatePromises.push(updatePolicyV2(policyId, updatedPolicyHostsAndRules));
  }

  return Promise.all(updatePromises);
};

export const useOnSave = (
  policy,
  updatedPolicyHostsAndRules,
  { onSave: onSaveCallback, onError: onErrorCallback } = {}
) => {
  const apiV2Enabled = useAPIV2FeatureFlag();
  const updatePolicyGraphQL = usePolicy();
  const updatePolicy = apiV2Enabled
    ? prepareUpdatePromises
    : updatePolicyGraphQL;

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
