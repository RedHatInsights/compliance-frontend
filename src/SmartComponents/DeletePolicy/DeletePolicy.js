import {
    Modal,
    TextContent,
    Button,
    Checkbox
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { DELETE_PROFILE } from '../../Utilities/graphql/mutations';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { dispatchAction } from '../../Utilities/Dispatcher';

const DeletePolicy = ({ isModalOpen, policy, toggle, onDelete }) => {
    const defaultDeleteAllState = false;
    const [deleteAllTestResults, setDeleteAll] = useState(defaultDeleteAllState);
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

    useEffect(() => {
        setDeleteAll(defaultDeleteAllState);
    }, [policy]);

    return (
        <Modal
            isSmall
            title='Delete policy'
            isOpen={isModalOpen}
            isFooterLeftAligned
            onClose={toggle}
            actions={[
                <Button key='destroy'
                    aria-label="delete"
                    variant='danger'
                    onClick={() => deletePolicy({ variables: { input: { id, deleteAllTestResults } } })}
                >
                    Delete policy
                </Button>,
                <Button key='cancel' variant='secondary' onClick={toggle}>
                    Cancel
                </Button>
            ]}
        >
            <TextContent>
                Are you sure you want to delete <b>{ name }</b>?
            </TextContent>
            <TextContent>
                This cannot be undone.
            </TextContent>
            <br />
            <Checkbox
                id={ `delete-all-reports-${id}` }
                isChecked={ deleteAllTestResults }
                onChange={ () => setDeleteAll(!deleteAllTestResults) }
                aria-label="delete-all-reports-checkbox"
                label="Delete all reports for this policy" />
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
