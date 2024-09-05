import React from 'react';
import {
  Button,
  ModalVariant,
  TextContent,
  Spinner,
  Bullseye,
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { DELETE_REPORT } from 'Mutations';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { ComplianceModal } from 'PresentationalComponents';
import { dispatchAction } from 'Utilities/Dispatcher';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';
import { apiInstance } from '../../Utilities/hooks/useQuery';

const DeleteReportBase = ({ id, deleteReport, onClose }) => {
  return (
    <ComplianceModal
      isOpen
      variant={ModalVariant.small}
      title="Delete report?"
      titleIconVariant="warning"
      ouiaId="DeleteReportModal"
      onClose={onClose}
      actions={[
        <Button
          key="destroy"
          ouiaId="DeleteReportButton"
          aria-label="delete"
          variant="danger"
          onClick={() => deleteReport(id)}
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
    </ComplianceModal>
  );
};

DeleteReportBase.propTypes = {
  id: propTypes.string.isRequired,
  onClose: propTypes.func,
  deleteReport: propTypes.func,
};

const DeleteReportRest = ({ reportId, onClose, onDelete }) => {
  const deleteReport = async () => {
    try {
      await apiInstance.deleteReport(reportId);
      dispatchAction(
        addNotification({
          variant: 'success',
          title: 'Report deleted',
          description:
            'Systems associated with this policy will upload reports on the next check-in.',
        })
      );
      onDelete();
    } catch (error) {
      dispatchAction(
        addNotification({
          variant: 'danger',
          title: 'Error removing report',
          description: error?.message,
        })
      );
      onClose();
    }
  };

  return (
    <DeleteReportBase
      id={reportId}
      deleteReport={deleteReport}
      onClose={onClose}
    />
  );
};

DeleteReportRest.propTypes = {
  reportId: propTypes.string.isRequired,
  onClose: propTypes.func,
  onDelete: propTypes.func,
};

const DeleteReportGraphQL = ({ reportId, onClose, onDelete }) => {
  const [callDeleteReport] = useMutation(DELETE_REPORT, {
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

  const deleteReport = () => {
    callDeleteReport({ variables: { input: { profileId: reportId } } });
  };

  return (
    <DeleteReportBase
      id={reportId}
      deleteReport={deleteReport}
      onClose={onClose}
    />
  );
};

DeleteReportGraphQL.propTypes = {
  reportId: propTypes.string.isRequired,
  onClose: propTypes.func,
  onDelete: propTypes.func,
};

const DeleteReportWrapper = () => {
  const { report_id: reportId } = useParams();
  const apiV2Enabled = useAPIV2FeatureFlag();
  const navigate = useNavigate();
  const onClose = () => {
    navigate(-1);
  };

  const onDelete = () => {
    navigate('/reports');
  };

  if (apiV2Enabled === undefined) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  const DeleteReportComponent = apiV2Enabled
    ? DeleteReportRest
    : DeleteReportGraphQL;

  return (
    <DeleteReportComponent
      reportId={reportId}
      onClose={onClose}
      onDelete={onDelete}
    />
  );
};

export default DeleteReportWrapper;
