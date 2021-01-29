import {
    Button,
    Modal,
    ModalVariant,
    TextContent
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { DELETE_PROFILE } from 'Utilities/graphql/mutations';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { dispatchAction } from 'Utilities/Dispatcher';

const DeletePolicy = () => {
    const location = useLocation();
    const history = useHistory();
    const { name, id } = location.state.policy;
    const onClose = () => {
        history.push('/scappolicies');
    };

    const [deletePolicy] = useMutation(DELETE_PROFILE, {
        onCompleted: () => {
            dispatchAction(addNotification({
                variant: 'success',
                title: `Removed policy ${ name }`
            }));
            onClose();
        },
        onError: (error) => {
            dispatchAction(addNotification({
                variant: 'danger',
                title: 'Error removing policy',
                description: error.message
            }));
            onClose();
        }
    });

    return (
        <Modal
            variant={ ModalVariant.small }
            title='Delete policy'
            isOpen
            onClose={ onClose }
            actions={[
                <Button key='destroy'
                    aria-label="delete"
                    variant='danger'
                    onClick={() => deletePolicy({ variables: { input: { id } } })}>
                    Delete policy
                </Button>,
                <Button key='cancel' variant='secondary' onClick={ onClose }>
                    Cancel
                </Button>
            ]}
        >
            <TextContent>
                Are you sure you want to delete <b>{ name }</b>?
                This cannot be undone.
            </TextContent>
        </Modal>
    );
};

DeletePolicy.propTypes = {
    policy: propTypes.object
};

export default DeletePolicy;
