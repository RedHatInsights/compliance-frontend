import { useCallback, useState } from 'react';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import useAssignRules from 'Utilities/hooks/api/useAssignRules';
import useAssignSystems from 'Utilities/hooks/api/useAssignSystems';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import useUpdatePolicy from 'Utilities/hooks/api/useUpdatePolicy';
import useUpdateTailoring from 'Utilities/hooks/api/useUpdateTailoring';

const useUpdatePolicyRest = (policy, updatedPolicyHostsAndRules) => {
  const {
    hosts,
    tailoringRules,
    description,
    businessObjective,
    complianceThreshold,
    tailoringValueOverrides,
  } = updatedPolicyHostsAndRules || {};

  const { fetch: assignRules } = useAssignRules({ skip: true });
  const { fetch: assignSystems } = useAssignSystems({ skip: true });
  const { fetch: fetchTailorings } = useTailorings({ skip: true });
  const { fetch: updatePolicy } = useUpdatePolicy({ skip: true });
  const { fetch: updateTailoring } = useUpdateTailoring({ skip: true });

  const updatePolicyRest = async () => {
    const policyId = policy.id;

    if (hosts !== undefined) {
      await assignSystems({ policyId, assignSystemsRequest: { ids: hosts } });
    }

    if (tailoringRules || tailoringValueOverrides) {
      const tailoringsResponse = await fetchTailorings(
        {
          policyId,
          limit: 100,
        },
        false,
      ); // fetch the most up-to-date tailorings
      const tailoringsUpdated = tailoringsResponse.data;
      if (tailoringRules) {
        for (const entry of Object.entries(tailoringRules)) {
          // assign rules
          const [osMinorVersion, rules] = entry;
          await assignRules({
            policyId,
            tailoringId: tailoringsUpdated.find(
              ({ os_minor_version }) =>
                os_minor_version === Number(osMinorVersion),
            ).id,
            assignRulesRequest: { ids: rules },
          });
        }
      }
      if (tailoringValueOverrides) {
        for (const entry of Object.entries(tailoringValueOverrides)) {
          // patch rule values
          const [osMinorVersion, valueOverrides] = entry;
          await updateTailoring({
            policyId,
            tailoringId: tailoringsUpdated.find(
              ({ os_minor_version }) =>
                os_minor_version === Number(osMinorVersion),
            ).id,
            valuesUpdate: { value_overrides: valueOverrides },
          });
        }
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
  policy,
  updatedPolicyHostsAndRules,
  { onSave: onSaveCallback, onError: onErrorCallback } = {},
) => {
  const addNotification = useAddNotification();
  const updatePolicy = useUpdatePolicyRest(policy, updatedPolicyHostsAndRules);

  const [isSaving, setIsSaving] = useState(false);

  const onSave = useCallback(() => {
    if (isSaving) {
      return Promise.resolve({});
    }

    setIsSaving(true);
    updatePolicy(policy, updatedPolicyHostsAndRules)
      .then(() => {
        setIsSaving(false);
        addNotification({
          variant: 'success',
          title: 'Policy updated',
          autoDismiss: true,
        });
        onSaveCallback?.(true);
      })
      .catch((error) => {
        setIsSaving(false);
        addNotification({
          variant: 'danger',
          title: 'Error updating policy',
          description: error.message,
        });
        onErrorCallback?.();
      });
  }, [isSaving, policy, updatedPolicyHostsAndRules]);

  return [isSaving, onSave];
};
