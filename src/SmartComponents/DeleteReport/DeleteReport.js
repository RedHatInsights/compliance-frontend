import React from 'react';
import { Button, Content } from '@patternfly/react-core';
import { ModalVariant } from '@patternfly/react-core/deprecated';
import { useParams } from 'react-router-dom';
import { ComplianceModal } from 'PresentationalComponents';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { apiInstance } from 'Utilities/hooks/useQuery';

import { useHandleDeleteReport } from './hooks';
/**
 * DeleteReport Component
 *
 * Renders the modal for deleting a report. It provides buttons for confirming
 * or canceling the deletion.
 *
 *  @returns {React.Element} The rendered DeleteReport component.
 */
const DeleteReport = () => {
  const handleDeleteReport = useHandleDeleteReport();
  const { report_id: reportId } = useParams();
  const navigate = useNavigate();
  const onClose = () => {
    navigate(-1);
  };

  const onDelete = () => {
    navigate('/reports');
  };
  const deleteReport = () =>
    handleDeleteReport(
      () => apiInstance.deleteReport(reportId),
      onDelete,
      onClose,
    );

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
          onClick={() => deleteReport(reportId)}
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
      <Content>Deleting a report is permanent and cannot be undone.</Content>
    </ComplianceModal>
  );
};

export default DeleteReport;
