import { useCallback, useState } from 'react';
import { usePolicy } from 'Mutations';
import { dispatchNotification } from 'Utilities/Dispatcher';
import useAPIV2FeatureFlag from 'Utilities/hooks/useAPIV2FeatureFlag';
import useAssignRules from '../../Utilities/hooks/api/useAssignRules';
import useAssignSystems from '../../Utilities/hooks/api/useAssignSystems';
import useTailorings from '../../Utilities/hooks/api/useTailorings';
import useUpdatePolicy from '../../Utilities/hooks/api/useUpdatePolicy';

const useUpdatePolicyRest = (policy, updatedPolicyHostsAndRules) => {
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
    const policyId = policy.id;

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
  policy,
  updatedPolicyHostsAndRules,
  { onSave: onSaveCallback, onError: onErrorCallback } = {}
) => {
  const apiV2Enabled = useAPIV2FeatureFlag();
  const updatePolicyGraphQL = usePolicy();
  const updatePolicyRest = useUpdatePolicyRest(
    policy,
    updatedPolicyHostsAndRules
  );
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
