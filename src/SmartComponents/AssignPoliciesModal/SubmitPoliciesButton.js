import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { ASSOCIATE_PROFILES_TO_SYSTEM } from '../../Utilities/graphql/mutations';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { dispatchAction } from '../../Utilities/Dispatcher';
import { reset } from 'redux-form';

const SubmitPoliciesButton = ({ policyIds, system, toggle, dispatch }) => {
    const [associateProfilesToSystem] = useMutation(ASSOCIATE_PROFILES_TO_SYSTEM, {
        onCompleted: (data) => {
            dispatchAction(addNotification({
                variant: 'success',
                title: `Associated ${data.associateProfiles.system.profiles.map((profile) => profile.name)} to ${system.name}`
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
        onClick={() => associateProfilesToSystem({ variables: { input: { profileIds: policyIds, id: system.id } } })}
        variant='primary'>Save</Button>;
};

SubmitPoliciesButton.propTypes = {
    policyIds: propTypes.arrayOf(propTypes.string).isRequired,
    system: propTypes.object.isRequired,
    toggle: propTypes.func.isRequired,
    dispatch: propTypes.func
};

export default SubmitPoliciesButton;
