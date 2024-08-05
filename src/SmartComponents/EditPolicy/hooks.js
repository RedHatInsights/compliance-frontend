import { useCallback, useState } from 'react';
import { usePolicy } from 'Mutations';
import { dispatchNotification } from 'Utilities/Dispatcher';
import { apiInstance } from '../../Utilities/hooks/useQuery';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';

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
