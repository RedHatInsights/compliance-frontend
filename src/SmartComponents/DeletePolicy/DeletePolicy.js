import {
    Button,
    Modal,
    ModalVariant,
    TextContent
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { DELETE_PROFILE } from 'Utilities/graphql/mutations';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { dispatchAction } from 'Utilities/Dispatcher';

const DeletePolicy = ({ isModalOpen, policy, toggle, onDelete }) => {
    const [deletePolicy] = useMutation(DELETE_PROFILE, {
        onCompleted: () => {
            dispatchAction(addNotification({
                variant: 'success',
                title: `Removed policy ${policy.name}`
            }));
            onDelete();
            toggle();
        },
        onError: (error) => {
            dispatchAction(addNotification({
                variant: 'danger',
                title: 'Error removing policy',
                description: error.message
            }));
            onDelete();
            toggle();
        }
    });
    const { name, id } = policy;

    return (
        <Modal
            variant={ ModalVariant.small }
            title='Delete policy'
            isOpen={isModalOpen}
            onClose={toggle}
            actions={[
                <Button key='destroy'
                    aria-label="delete"
                    variant='danger'
                    onClick={() => deletePolicy({ variables: { input: { id } } })}>
                    Delete policy
                </Button>,
                <Button key='cancel' variant='secondary' onClick={toggle}>
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
    policy: propTypes.object,
    toggle: propTypes.func,
    isModalOpen: propTypes.bool,
    onDelete: propTypes.func
};

export default DeletePolicy;
