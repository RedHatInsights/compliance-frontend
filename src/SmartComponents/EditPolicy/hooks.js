import { useState } from 'react';
import { usePolicy } from 'Mutations';
import { useLinkToBackground, useAnchor } from 'Utilities/Router';
import { dispatchNotification } from 'Utilities/Dispatcher';

export const useLinkToPolicy = () => {
  const anchor = useAnchor();
  //added the ternary operator to utilize the same hook for the policy table and policy details
  const linkToBackground = useLinkToBackground('/scappolicies');
  return () => {
    linkToBackground({ hash: anchor });
  };
};

export const useOnSave = (policy, updatedPolicyHostsAndRules) => {
  const updatePolicy = usePolicy();
  const linkToPolicy = useLinkToPolicy(false);
  const [isSaving, setIsSaving] = useState(false);
  const onSave = () => {
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
  };

  return [isSaving, onSave];
};

export const useOnSavePolicyDetails = (
  policy,
  updatedPolicyHostsAndRules,
  closingFunction,
  address
) => {
  const updatePolicy = usePolicy();
  const linkToPolicy = useLinkToBackground(address);
  const [isSaving, setIsSaving] = useState(false);
  const onSave = () => {
    if (isSaving) {
      return Promise.resolve({});
    }
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
  };
  return [isSaving, onSave];
};
