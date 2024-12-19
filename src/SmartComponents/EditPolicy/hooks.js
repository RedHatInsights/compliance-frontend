import { useCallback, useState } from 'react';
import { dispatchNotification } from 'Utilities/Dispatcher';
import useAssignRules from '../../Utilities/hooks/api/useAssignRules';
import useAssignSystems from '../../Utilities/hooks/api/useAssignSystems';
import useTailorings from '../../Utilities/hooks/api/useTailorings';
import useUpdatePolicy from '../../Utilities/hooks/api/useUpdatePolicy';

const useUpdatePolicyRest = (policyId, updatedPolicyHostsAndRules) => {
  const {
    hosts,
    tailoringRules,
    description,
    businessObjective,
    complianceThreshold,
  } = updatedPolicyHostsAndRules || {};

  const { fetch: assignRules } = useAssignRules({ skip: true });
  const { fetch: assignSystems } = useAssignSystems({ skip: true });
  const { fetch: fetchTailorings } = useTailorings({ skip: true });
  const { fetch: updatePolicy } = useUpdatePolicy({ skip: true });

  const updatePolicyRest = async () => {
    if (hosts !== undefined) {
      await assignSystems({ policyId, assignSystemsRequest: { ids: hosts } });
    }

    if (tailoringRules) {
      const tailoringsResponse = await fetchTailorings(
        {
          policyId,
          limit: 100,
        },
        false
      ); // fetch the most up-to-date tailorings
      const tailoringsUpdated = tailoringsResponse.data;
      for (const entry of Object.entries(tailoringRules)) {
        const [osMinorVersion, rules] = entry;
        await assignRules({
          policyId,
          tailoringId: tailoringsUpdated.find(
            ({ os_minor_version }) =>
              os_minor_version === Number(osMinorVersion)
          ).id,
          assignRulesRequest: { ids: rules },
        });
      }
    }

    if (description || businessObjective || complianceThreshold) {
      await updatePolicy({
        policyId,
        policyUpdate: {
          description,
          business_objective: businessObjective?.title ?? '--',
          compliance_threshold: parseFloat(complianceThreshold),
        },
      });
    }
  };

  return updatePolicyRest;
};

export const useOnSave = (
  policyId,
  updatedPolicyHostsAndRules,
  { onSave: onSaveCallback, onError: onErrorCallback } = {}
) => {
  const updatePolicy = useUpdatePolicyRest(
    policyId,
    updatedPolicyHostsAndRules
  );

  const [isSaving, setIsSaving] = useState(false);

  const onSave = useCallback(() => {
    if (isSaving) {
      return Promise.resolve({});
    }

    setIsSaving(true);
    updatePolicy()
      .then(() => {
        setIsSaving(false);
        dispatchNotification({
          variant: 'success',
          title: 'Policy updated',
          autoDismiss: true,
        });
        onSaveCallback?.(true);
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
  }, [isSaving, policyId, updatedPolicyHostsAndRules]);

  return [isSaving, onSave];
};
