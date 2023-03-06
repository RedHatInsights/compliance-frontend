import { useCallback } from 'react';

import usePolicyMutation from '@/Mutations/hooks/usePolicyMutation';
import { dispatchNotification } from 'Utilities/Dispatcher';

const useSaveValueToPolicy = (policy, callback) => {
  const updatePolicy = usePolicyMutation();

  const existingValues = useCallback(
    (policyId) => {
      const profile = policy.policy.profiles.find(({ id }) => id === policyId);

      return Object.fromEntries(
        Object.entries(profile?.values || {}).map(([valueId, value]) => {
          const refId = profile.benchmark.valueDefinitions.find(
            ({ id }) => id === valueId
          )?.refId;
          return [refId || valueId, value];
        })
      );
    },
    [policy]
  );

  const saveToPolicy = useCallback(
    (policyId, valueDefinition, newValue) => {
      const profile = policy.policy.profiles.find(({ id }) => id === policyId);

      const existingValues = Object.fromEntries(
        Object.entries(profile?.values || {}).map(([valueId, value]) => {
          const refId = profile.benchmark.valueDefinitions.find(
            ({ id }) => id === valueId
          )?.refId;
          return [refId || valueId, value];
        })
      );

      return updatePolicy(policyId, {
        values: {
          ...existingValues,
          [valueDefinition.refId]: newValue,
        },
      })
        .then(() => {
          dispatchNotification({
            variant: 'success',
            title: 'Rule value updated',
            autoDismiss: true,
          });
        })
        .catch((error) => {
          dispatchNotification({
            variant: 'danger',
            title: 'Error updating rule value',
            description: error.message,
          });
        })
        .finally(() => callback());
    },
    [existingValues, policy]
  );

  return saveToPolicy;
};

export default useSaveValueToPolicy;
