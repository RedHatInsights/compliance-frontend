import {
    Modal,
    TextContent,
    Button
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { DELETE_PROFILE } from '../../Utilities/graphql/mutations';

const DeletePolicy = ({ isModalOpen, policy, toggle, onDelete }) => {
    const [deletePolicy] = useMutation(DELETE_PROFILE);
    const { name, id } = policy;

    return (
        <React.Fragment>
            <Modal
                isSmall
                title='Delete policy'
                isOpen={isModalOpen}
                onClose={toggle}
                actions={[
                    <Button key='destroy' variant='danger'
                        onClick={() => {
                            deletePolicy({ variables: { input: { id } } });
                            onDelete();
                            toggle();
                        }} >
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
            </Modal>
        </React.Fragment>
    );
};

DeletePolicy.propTypes = {
    policy: propTypes.object,
    toggle: propTypes.func,
    isModalOpen: propTypes.bool,
    onDelete: propTypes.func
};

export default DeletePolicy;
