import { useCallback, useState } from 'react';
import { usePolicy } from 'Mutations';
import useAnchor from 'Utilities/hooks/useAnchor';
import useLinkToBackground from 'Utilities/hooks/useLinkToBackground';
import { dispatchNotification } from 'Utilities/Dispatcher';

export const useLinkToPolicy = () => {
  const anchor = useAnchor();
  const linkToBackground = useLinkToBackground('/scappolicies');
  return () => {
    linkToBackground({ hash: anchor });
  };
};

export const useOnSave = (policy, updatedPolicyHostsAndRules) => {
  const updatePolicy = usePolicy();
  const linkToPolicy = useLinkToPolicy();
  const [isSaving, setIsSaving] = useState(false);

  const onSave = useCallback(() => {
    if (isSaving) {
      return Promise.resolve({});
    }

    setIsSaving(true);
    updatePolicy(policy, updatedPolicyHostsAndRules)
      .then(() => {
        setIsSaving(false);
        dispatchNotification({
          variant: 'success',
          title: 'Policy updated',
          autoDismiss: true,
        });
        linkToPolicy();
      })
      .catch((error) => {
        setIsSaving(false);
        dispatchNotification({
          variant: 'danger',
          title: 'Error updating policy',
          description: error.message,
        });
        linkToPolicy();
      });
  }, [isSaving, policy, updatedPolicyHostsAndRules]);

  return [isSaving, onSave];
};
export const useSavePolicyDetails = (policyId) => {
  const anchor = useAnchor();
  const linkToBackground = useLinkToBackground(`/scappolicies/${policyId}`);
  return () => {
    linkToBackground({ hash: anchor });
  };
};

export const useOnSavePolicyDetails = (
  policy,
  updatedPolicyHostsAndRules,
  closingFunction,
  policyId
) => {
  const updatePolicy = usePolicy();
  const savePolicyDetails = useSavePolicyDetails(policyId);
  const [isSaving, setIsSaving] = useState(false);
  const onSave = () => {
    setIsSaving(true);
    closingFunction();
    updatePolicy(policy, updatedPolicyHostsAndRules)
      .then(() => {
        setIsSaving(false);
        dispatchNotification({
          variant: 'success',
          title: 'Policy updated',
          autoDismiss: true,
        });
        savePolicyDetails();
      })
      .catch((error) => {
        setIsSaving(false);
        dispatchNotification({
          variant: 'danger',
          title: 'Error updating policy',
          description: error.message,
        });
        savePolicyDetails();
      });
  };
  return [isSaving, onSave];
};
