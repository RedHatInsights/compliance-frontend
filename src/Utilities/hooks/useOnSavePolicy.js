import { useCallback, useState } from 'react';
import { usePolicy } from 'Mutations';
import { dispatchNotification } from 'Utilities/Dispatcher';

export const useOnSavePolicy = ({
  onSave: onSaveCallback,
  onError: onErrorCallback,
} = {}) => {
  const updatePolicy = usePolicy();
  const [isSaving, setIsSaving] = useState(false);

  const onSave = useCallback(
    (policy, updatedPolicyHostsAndRules) => {
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
    },
    [isSaving]
  );

  return [isSaving, onSave];
};

export default useOnSavePolicy;
