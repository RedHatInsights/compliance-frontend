import React from 'react';
import propTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Button } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { dispatchAction } from 'Utilities/Dispatcher';
import { ASSOCIATE_SYSTEMS_TO_PROFILES } from 'Utilities/graphql/mutations';

export const completedMessage = (profile) => {
    const systems = profile.systems.map(system => system.name);
    let message;
    if (systems.length > 0) {
        message = `Associated ${systems} to ${profile.name}`;
    } else {
        message = `${profile.name} is no longer associated to any policies`;
    }

    return message;
};

export const SubmitEditSystemsButton = ({ systemIds, policyId }) => {
    const [associateSystemsToProfile] = useMutation(ASSOCIATE_SYSTEMS_TO_PROFILES, {
        onCompleted: (data) => {
            dispatchAction(addNotification({
                variant: 'success',
                title: completedMessage(data.associateSystems.profile)
            }));
        },
        onError: (error) => {
            dispatchAction(addNotification({
                variant: 'danger',
                title: 'Error associating systems',
                description: error.message
            }));
        }
    });

    return <Button type='submit' aria-label='save'
        onClick={() => associateSystemsToProfile({ variables: { input: { systemIds, id: policyId } } })}
        variant='primary'>Save</Button>;
};

SubmitEditSystemsButton.propTypes = {
    systemIds: propTypes.arrayOf(propTypes.string).isRequired,
    policyId: propTypes.string.isRequired
};

SubmitEditSystemsButton.defaultProps = {
    systemIds: []
};
