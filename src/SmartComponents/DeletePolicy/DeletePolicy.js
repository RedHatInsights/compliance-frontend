import {
    Modal,
    TextContent,
    Button
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { DELETE_PROFILE } from '../../Utilities/graphql/mutations';

const DeletePolicy = ({ name, id }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletePolicy] = useMutation(DELETE_PROFILE);

    return (
        <React.Fragment>
            <div onClick={() => setIsModalOpen(true)}>Delete policy</div>
            <Modal
                isSmall
                title='Delete policy'
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                actions={[
                    <Button key='cancel' variant='danger'
                        onClick={() => deletePolicy({ variables: { id } })}
                    >
                        Delete policy
                    </Button>,
                    <Button key='cancel' variant='secondary' onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </Button>
                ]}
            >
                <TextContent>
                    Are you sure you want to delete the <b>{ name }</b> policy?. This cannot be undone.
                </TextContent>
            </Modal>
        </React.Fragment>
    );
};

DeletePolicy.propTypes = {
    name: propTypes.string,
    id: propTypes.string
};

export default DeletePolicy;
