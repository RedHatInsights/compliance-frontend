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
import { ComplianceModal } from 'PresentationalComponents';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';
import { apiInstance } from '../../Utilities/hooks/useQuery';
import { handleDeleteReport } from '../CreatePolicy/helpers';

/**
 * DeleteReportBase Component
 *
 * Renders the base modal for deleting a report. It provides buttons for confirming
 * or canceling the deletion.
 *
 *  @param   {object}        props              - The properties passed to the component.
 *  @param   {string}        props.id           - The ID of the report to be deleted.
 *  @param   {Function}      props.deleteReport - Function to call when the delete button is clicked.
 *  @param   {Function}      props.onClose      - Function to call when the cancel button or modal close is triggered.
 *
 *  @returns {React.Element}                    The rendered DeleteReportBase component.
 */
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

/**
 * DeleteReportRest Component
 *
 * Handles report deletion using a REST API.
 *
 *  @param   {object}        props          - The properties passed to the component.
 *  @param   {string}        props.reportId - The ID of the report to be deleted.
 *  @param   {Function}      props.onClose  - Function to call when the modal is closed.
 *  @param   {Function}      props.onDelete - Function to call when the report is successfully deleted.
 *
 *  @returns {React.Element}                The rendered DeleteReportRest component.
 */
const DeleteReportRest = ({ reportId, onClose, onDelete }) => {
  const deleteReport = () =>
    handleDeleteReport(
      () => apiInstance.deleteReport(reportId),
      onDelete,
      onClose
    );

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

/**
 * DeleteReportGraphQL Component
 *
 * Handles report deletion using a GraphQL.
 *
 *  @param   {object}        props          - The properties passed to the component.
 *  @param   {string}        props.reportId - The ID of the report to be deleted.
 *  @param   {Function}      props.onClose  - Function to call when the modal is closed.
 *  @param   {Function}      props.onDelete - Function to call when the report is successfully deleted.
 *
 *  @returns {React.Element}                The rendered DeleteReportGraphQL component.
 */
const DeleteReportGraphQL = ({ reportId, onClose, onDelete }) => {
  const [callDeleteReport] = useMutation(DELETE_REPORT, {
    onCompleted: () =>
      handleDeleteReport(() => Promise.resolve(), onDelete, onClose),
    onError: (error) =>
      handleDeleteReport(() => Promise.reject(error), onDelete, onClose),
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

/**
 * DeleteReportWrapper Component
 *
 * This component decides to show a loading spinner or the component once apiV2 is defined
 *
 *  @returns {React.Element} The rendered DeleteReportWrapper component.
 */
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

  const DeleteReportComponent = apiV2Enabled
    ? DeleteReportRest
    : DeleteReportGraphQL;

  return (
    <>
      {apiV2Enabled === undefined ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : (
        <DeleteReportComponent
          reportId={reportId}
          onClose={onClose}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default DeleteReportWrapper;
