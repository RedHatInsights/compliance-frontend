import { useState } from 'react';
import { usePolicy } from 'Mutations';
import { useLinkToBackground, useAnchor } from 'Utilities/Router';
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
    const onSave = () => {
        if (isSaving) { return Promise.resolve({}); }

        setIsSaving(true);
        updatePolicy(policy, updatedPolicyHostsAndRules).then(() => {
            setIsSaving(false);
            dispatchNotification({
                variant: 'success',
                title: 'Policy successfully updated',
                autoDismiss: true
            });
            linkToPolicy();
        }).catch((error) => {
            setIsSaving(false);
            dispatchNotification({
                variant: 'danger',
                title: 'Error updating policy',
                description: error.message
            });
            linkToPolicy();
        });
    };

    return [isSaving, onSave];
};
