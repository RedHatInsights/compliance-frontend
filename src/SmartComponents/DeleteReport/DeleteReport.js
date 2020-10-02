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
import { DELETE_REPORT } from 'Utilities/graphql/mutations';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { dispatchAction } from 'Utilities/Dispatcher';

const DeleteReport = () => {
    const history = useHistory();
    const location = useLocation();
    const { id } = location.state?.profile;
    const onClose = () => {
        history.push(location.state.background);
    };

    const [deleteReport] = useMutation(DELETE_REPORT, {
        onCompleted: () => {
            dispatchAction(addNotification({
                variant: 'success',
                title: `Removed report`
            }));
        },
        onError: (error) => {
            dispatchAction(addNotification({
                variant: 'danger',
                title: 'Error removing report',
                description: error.message
            }));
        }
    });
    return (
        <Modal
            isOpen
            variant={ ModalVariant.small }
            title='Delete report'
            onClose={ onClose }
            actions={[
                <Button
                    key='destroy'
                    aria-label="delete"
                    variant='danger'
                    onClick={() => deleteReport({
                        variables: {
                            input: {
                                profileId: id
                            }
                        }
                    })}>
                    Delete report
                </Button>,
                <Button key='cancel' variant='secondary' onClick={ () => onClose() }>
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
