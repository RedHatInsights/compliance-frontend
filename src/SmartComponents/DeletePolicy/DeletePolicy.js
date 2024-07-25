import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import {
  Button,
  Checkbox,
  ModalVariant,
  Text,
  Spinner,
} from '@patternfly/react-core';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import {
  ComplianceModal,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import { dispatchAction } from 'Utilities/Dispatcher';
import useQuery, { apiInstance } from '../../Utilities/hooks/useQuery';

const DeletePolicy = () => {
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const navigate = useNavigate();
  const { policy_id: policyId } = useParams();
  const { data, error, loading } = useQuery(apiInstance.policy, {
    params: [policyId],
  });

  const title = data?.data?.title ?? '';

  const onClose = () => {
    navigate('/scappolicies');
  };

  const deletePolicy = async () => {
    try {
      await apiInstance.deletePolicy(policyId);
      dispatchAction(
        addNotification({
          variant: 'success',
          title: `Deleted "${title}" and its associated reports`,
        })
      );
      onClose();
    } catch (error) {
      dispatchAction(
        addNotification({
          variant: 'danger',
          title: 'Error removing policy',
          description: error.message,
        })
      );
    } finally {
      onClose();
    }
  };

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
          onClick={deletePolicy}
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
            Deleting the policy <b>{title}</b> will also delete its associated
            reports.
          </Text>
          <Checkbox
            label="I understand this will delete the policy and all associated reports"
            id={`deleting-policy-check-${policyId}`}
            isChecked={deleteEnabled}
            onChange={(_, v) => setDeleteEnabled(v)}
            isDisabled={loading}
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
