import React from 'react';
import propTypes from 'prop-types';
import { reset } from 'redux-form';
import { useMutation } from '@apollo/react-hooks';
import { Button } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';

import { dispatchAction } from 'Utilities/Dispatcher';
import { ASSOCIATE_PROFILES_TO_SYSTEM } from 'Utilities/graphql/mutations';

export const completedMessage = (system) => {
    const profiles = system.profiles.map((profile) => profile.name);
    let message;
    if (profiles.length > 0) {
        message = `Associated ${profiles} to ${system.name}`;
    } else {
        message = `${system.name} is no longer associated to any policies`;
    }

    return message;
};

export const SubmitPoliciesButton = ({ policyIds, systemId, toggle, dispatch }) => {
    const [associateProfilesToSystem] = useMutation(ASSOCIATE_PROFILES_TO_SYSTEM, {
        onCompleted: (data) => {
            dispatchAction(addNotification({
                variant: 'success',
                title: completedMessage(data.associateProfiles.system)
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

SubmitPoliciesButton.defaultProps = {
    policyIds: []
};
