import { useCallback, useState } from 'react';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import useAssignRules from 'Utilities/hooks/api/useAssignRules';
import useAssignSystems from 'Utilities/hooks/api/useAssignSystems';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import useUpdatePolicy from 'Utilities/hooks/api/useUpdatePolicy';
import useUpdateTailoring from 'Utilities/hooks/api/useUpdateTailoring';

const useSavePolicy = ({ id: policyId } = {}, updatedPolicyHostsAndRules) => {
  const {
    hosts,
    tailoringRules,
    description,
    business_objective,
    compliance_threshold,
    tailoringValueOverrides,
  } = updatedPolicyHostsAndRules || {};
  const params = { policyId };
  const { fetchBatched: fetchTailorings } = useTailorings({
    params,
    skip: true,
  });
  const { fetchQueue: assignRules } = useAssignRules({ params });
  const { fetch: assignSystems } = useAssignSystems({ params });
  const { fetch: updatePolicy } = useUpdatePolicy({ params });
  const { fetchQueue: updateTailorings } = useUpdateTailoring({ params });

  const save = async () => {
    if (hosts) {
      await assignSystems({ assignSystemsRequest: { ids: hosts } });
    }

    if (tailoringRules || tailoringValueOverrides) {
      const tailoringsResponse = await fetchTailorings();
      const tailoringsUpdated = tailoringsResponse.data;

      if (tailoringRules) {
        const tailoringUpdates = Object.entries(tailoringRules).map(
          ([osMinorVersion, rules]) => ({
            tailoringId: tailoringsUpdated.find(
              ({ os_minor_version }) =>
                os_minor_version === Number(osMinorVersion),
            ).id,
            assignRulesRequest: { ids: rules },
          }),
        );

        await assignRules(tailoringUpdates);
      }

      if (tailoringValueOverrides) {
        const tailoringUpdates = Object.entries(tailoringValueOverrides).map(
          ([osMinorVersion, valueOverrides]) => ({
            tailoringId: tailoringsUpdated.find(
              ({ os_minor_version }) =>
                os_minor_version === Number(osMinorVersion),
            ).id,
            valuesUpdate: { value_overrides: valueOverrides },
          }),
        );

        await updateTailorings(tailoringUpdates);
      }
    }

    if (description || business_objective || compliance_threshold) {
      await updatePolicy({
        policyUpdate: {
          description,
          business_objective: business_objective ?? '--',
          compliance_threshold: parseFloat(compliance_threshold),
        },
      });
    }
  };

  return save;
};

export const useOnSave = (
  policy,
  updatedPolicyHostsAndRules,
  {
    onSave: onSaveCallback = () => ({}),
    onError: onErrorCallback = () => ({}),
  } = {},
) => {
  const addNotification = useAddNotification();
  const savePolicy = useSavePolicy(policy, updatedPolicyHostsAndRules);

  const [isSaving, setIsSaving] = useState(false);

  const onSave = useCallback(() => {
    if (isSaving) {
      return Promise.resolve({});
    }

    setIsSaving(true);
    savePolicy(policy, updatedPolicyHostsAndRules)
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
  }, [
    savePolicy,
    isSaving,
    policy,
    updatedPolicyHostsAndRules,
    onSaveCallback,
    onErrorCallback,
    addNotification,
  ]);

  return [isSaving, onSave];
};
