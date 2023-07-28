import { Button, Checkbox, ModalVariant, Text } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { useMutation } from '@apollo/client';
import { DELETE_PROFILE } from 'Mutations';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { ComplianceModal } from 'PresentationalComponents';
import { dispatchAction } from 'Utilities/Dispatcher';

const DeletePolicy = () => {
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { name, id } = location.state.policy;
  const onClose = () => {
    navigate('/scappolicies');
  };

  const [deletePolicy] = useMutation(DELETE_PROFILE, {
    onCompleted: () => {
      dispatchAction(
        addNotification({
          variant: 'success',
          title: `Deleted "${name}" and its associated reports`,
        })
      );
      onClose();
    },
    onError: (error) => {
      dispatchAction(
        addNotification({
          variant: 'danger',
          title: 'Error removing policy',
          description: error.message,
        })
      );
      onClose();
    },
  });

  return (
    <ComplianceModal
      variant={ModalVariant.small}
      title="Delete policy?"
      titleIconVariant="warning"
      ouiaId="DeletePolicyModal"
      isOpen
      onClose={onClose}
      actions={[
        <Button
          key="destroy"
          ouiaId="DeletePolicyButton"
          aria-label="delete"
          isDisabled={!deleteEnabled}
          variant="danger"
          onClick={() => deletePolicy({ variables: { input: { id } } })}
        >
          Delete policy and associated reports
        </Button>,
        <Button
          key="cancel"
          ouiaId="DeletePolicyCancelButton"
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>,
      ]}
    >
      <Text className="policy-delete-body-text">
        Deleting the policy <b>{name}</b> will also delete its associated
        reports.
      </Text>
      <Checkbox
        label="I understand this will delete the policy and all associated reports"
        id={`deleting-policy-check-${id}`}
        isChecked={deleteEnabled}
        onChange={setDeleteEnabled}
      />
    </ComplianceModal>
  );
};

DeletePolicy.propTypes = {
  policy: propTypes.object,
};

export default DeletePolicy;
