import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { ASSOCIATE_PROFILES_TO_SYSTEM } from '../../Utilities/graphql/mutations';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { dispatchAction } from '../../Utilities/Dispatcher';
import { reset } from 'redux-form';

const successfulMessage = (data) => (
    (data.associateProfiles.system.profiles.length === 0) ?
        `System ${data.associateProfiles.system.name} has no policies attached now. ` +
        `This system is now being deleted from Compliance` :
        `Associated ${data.associateProfiles.system.profiles.map((profile) => profile.name)} ` +
            `to ${data.associateProfiles.system.name}`
);

const SubmitPoliciesButton = ({ policyIds, systemId, toggle, dispatch }) => {
    const [associateProfilesToSystem] = useMutation(ASSOCIATE_PROFILES_TO_SYSTEM, {
        onCompleted: (data) => {
            dispatchAction(addNotification({
                variant: 'success',
                title: successfulMessage(data)
            }));
            toggle();
            dispatch(reset('assignPolicies'));
        },
        onError: (error) => {
            dispatchAction(addNotification({
                variant: 'danger',
                title: 'Error associating policies',
                description: error.message
            }));
            toggle();
            dispatch(reset('assignPolicies'));
        }
    });

    return <Button type='submit' aria-label='save'
        onClick={() => associateProfilesToSystem({ variables: { input: { profileIds: policyIds, id: systemId } } })}
        variant='primary'>Save</Button>;
};

SubmitPoliciesButton.propTypes = {
    policyIds: propTypes.arrayOf(propTypes.string).isRequired,
    systemId: propTypes.string.isRequired,
    toggle: propTypes.func.isRequired,
    dispatch: propTypes.func
};

export default SubmitPoliciesButton;
