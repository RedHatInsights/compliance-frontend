import React from 'react';
import propTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Button } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { dispatchAction } from 'Utilities/Dispatcher';
import { ASSOCIATE_SYSTEMS_TO_PROFILES } from 'Utilities/graphql/mutations';

export const SubmitEditSystemsButton = ({ systemIds, policyId, onComplete }) => {
    const [associateSystemsToProfile] = useMutation(ASSOCIATE_SYSTEMS_TO_PROFILES, {
        onCompleted: () => {
            dispatchAction(addNotification({
                variant: 'success',
                title: 'Success associating systems to profile'
            }));
            onComplete();
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
    policyId: propTypes.string.isRequired,
    onComplete: propTypes.func
};

SubmitEditSystemsButton.defaultProps = {
    systemIds: []
};
