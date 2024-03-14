import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Button,
  Checkbox,
  ModalVariant,
  Text,
  Spinner,
} from '@patternfly/react-core';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { DELETE_PROFILE } from 'Mutations';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import {
  ComplianceModal,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import { dispatchAction } from 'Utilities/Dispatcher';
import usePolicyQuery from 'Utilities/hooks/usePolicyQuery';

const DeletePolicy = () => {
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const navigate = useNavigate();
  const { policy_id: policyId } = useParams();
  const { data, error, loading } = usePolicyQuery({
    policyId,
    minimal: true,
  });
  const {
    profile: { name, id },
  } = data || { profile: {} };
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
      <StateViewWithError stateValues={{ error, data, loading }}>
        <StateViewPart stateKey="loading">
          <Spinner />
        </StateViewPart>
        <StateViewPart stateKey="data">
          <Text className="policy-delete-body-text">
            Deleting the policy <b>{name}</b> will also delete its associated
            reports.
          </Text>
          <Checkbox
            label="I understand this will delete the policy and all associated reports"
            id={`deleting-policy-check-${id}`}
            isChecked={deleteEnabled}
            onChange={(_event, val) => setDeleteEnabled(val)}
          />
        </StateViewPart>
      </StateViewWithError>
    </ComplianceModal>
  );
};

DeletePolicy.propTypes = {
  policy: propTypes.object,
};

export default DeletePolicy;
