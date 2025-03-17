import { useCallback, useState } from 'react';
import { dispatchNotification } from 'Utilities/Dispatcher';
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
    businessObjective,
    complianceThreshold,
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
                os_minor_version === Number(osMinorVersion)
            ).id,
            assignRulesRequest: { ids: rules },
          })
        );

        await assignRules(tailoringUpdates);
      }

      if (tailoringValueOverrides) {
        const tailoringUpdates = Object.entries(tailoringValueOverrides).map(
          ([osMinorVersion, valueOverrides]) => ({
            tailoringId: tailoringsUpdated.find(
              ({ os_minor_version }) =>
                os_minor_version === Number(osMinorVersion)
            ).id,
            valuesUpdate: { value_overrides: valueOverrides },
          })
        );

        await updateTailorings(tailoringUpdates);
      }
    }

    if (description || businessObjective || complianceThreshold) {
      await updatePolicy({
        policyUpdate: {
          description,
          business_objective: businessObjective?.title ?? '--',
          compliance_threshold: parseFloat(complianceThreshold),
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
  } = {}
) => {
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
  }, [
    savePolicy,
    isSaving,
    policy,
    updatedPolicyHostsAndRules,
    onSaveCallback,
    onErrorCallback,
  ]);

  return [isSaving, onSave];
};
