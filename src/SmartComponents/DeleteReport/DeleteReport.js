import {
    Modal,
    TextContent,
    Button
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { DELETE_REPORT } from 'Utilities/graphql/mutations';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { dispatchAction } from 'Utilities/Dispatcher';

const DeleteReport = ({ policyId, isModalOpen, onClose, onDelete }) => {
    const [modalOpen, setModalOpen] = useState(isModalOpen);
    const closeModal = (removed = false) => {
        setModalOpen(false);
        onClose(removed);
    };

    const [deleteReport] = useMutation(DELETE_REPORT, {
        onCompleted: () => {
            dispatchAction(addNotification({
                variant: 'success',
                title: `Removed report`
            }));
            onDelete();
            closeModal(true);
        },
        onError: (error) => {
            dispatchAction(addNotification({
                variant: 'danger',
                title: 'Error removing report',
                description: error.message
            }));
            closeModal();
        }
    });

    useEffect(() => {
        setModalOpen(isModalOpen);
    }, [isModalOpen]);

    return (
        <Modal
            isSmall
            title='Delete report'
            isOpen={ modalOpen }
            isFooterLeftAligned
            onClose={ closeModal }
            actions={[
                <Button
                    key='destroy'
                    aria-label="delete"
                    variant='danger'
                    onClick={() => deleteReport({
                        variables: {
                            input: {
                                profileId: policyId
                            }
                        }
                    })}>
                    Delete report
                </Button>,
                <Button key='cancel' variant='secondary' onClick={ () => closeModal() }>
                    Cancel
                </Button>
            ]}>
            <TextContent>
                Deleting a report is permanent and cannot be undone.
            </TextContent>
        </Modal>
    );
};

DeleteReport.propTypes = {
    onClose: propTypes.func,
    isModalOpen: propTypes.bool,
    onDelete: propTypes.func,
    policyId: propTypes.string
};

DeleteReport.defaultProps = {
    onDelete: () => {},
    onClose: () => {}
};

export default DeleteReport;
