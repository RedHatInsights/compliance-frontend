import {
  Button,
  Modal,
  ModalVariant,
  TextContent,
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { DELETE_REPORT } from 'Mutations';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { dispatchAction } from 'Utilities/Dispatcher';

const DeleteReport = () => {
  const history = useHistory();
  const location = useLocation();
  const { id } = location.state?.profile;
  const onClose = () => {
    history.push(location.state.background);
  };

  const onDelete = () => {
    history.push('/reports');
  };

  const [deleteReport] = useMutation(DELETE_REPORT, {
    onCompleted: () => {
      dispatchAction(
        addNotification({
          variant: 'success',
          title: 'Report deleted',
          description:
            'Systems associated with this policy will upload reports on the next check-in.',
        })
      );
      onDelete();
    },
    onError: (error) => {
      dispatchAction(
        addNotification({
          variant: 'danger',
          title: 'Error removing report',
          description: error.message,
        })
      );
      onClose();
    },
  });
  return (
    <Modal
      isOpen
      variant={ModalVariant.small}
      title="Delete report"
      ouiaId="DeleteReportModal"
      onClose={onClose}
      actions={[
        <Button
          key="destroy"
          ouiaId="DeleteReportButton"
          aria-label="delete"
          variant="danger"
          onClick={() =>
            deleteReport({
              variables: {
                input: {
                  profileId: id,
                },
              },
            })
          }
        >
          Delete report
        </Button>,
        <Button
          key="cancel"
          ouiaId="DeleteReportCancelButton"
          variant="secondary"
          onClick={() => onClose()}
        >
          Cancel
        </Button>,
      ]}
    >
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
  policyId: propTypes.string,
};

DeleteReport.defaultProps = {
  onDelete: () => {},
  onClose: () => {},
};

export default DeleteReport;
