import { useCallback, useState } from 'react';
import { usePolicy } from 'Mutations';
import { dispatchNotification } from 'Utilities/Dispatcher';
import { apiInstance } from 'Utilities/hooks/useQuery';
import useAPIV2FeatureFlag from 'Utilities/hooks/useAPIV2FeatureFlag';

// TODO: rework the direct apiInstance calls with API hooks

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

const getTailorings = (policyId) =>
  apiInstance.tailorings(
    policyId,
    undefined, // xRHIDENTITY
    100 // limit
  );

const updatePolicyRest = async (policy, updatedPolicyHostsAndRules) => {
  const {
    hosts,
    tailoringRules,
    description,
    businessObjective,
    complianceThreshold,
  } = updatedPolicyHostsAndRules;
  const policyId = policy.id;

  if (hosts !== undefined) {
    await updateAssignedSystems(policyId, hosts);
  }

  if (tailoringRules) {
    const tailoringsResponse = await getTailorings(policyId); // fetch the most up-to-date tailorings
    const tailoringsUpdated = tailoringsResponse.data.data;
    for (const entry of Object.entries(tailoringRules)) {
      const [osMinorVersion, rules] = entry;
      await updateAssignedRules(
        policyId,
        tailoringsUpdated.find(
          ({ os_minor_version }) => os_minor_version === Number(osMinorVersion)
        ).id,
        rules
      );
    }
  }

  if (description || businessObjective || complianceThreshold) {
    await updatePolicyV2(policyId, {
      description,
      businessObjective,
      complianceThreshold,
    });
  }
};

export const useOnSave = (
  policy,
  updatedPolicyHostsAndRules,
  { onSave: onSaveCallback, onError: onErrorCallback } = {}
) => {
  const apiV2Enabled = useAPIV2FeatureFlag();
  const updatePolicyGraphQL = usePolicy();
  const updatePolicy = apiV2Enabled ? updatePolicyRest : updatePolicyGraphQL;

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
