import React, { useState } from 'react';
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
import usePolicy from 'Utilities/hooks/api/usePolicy';
import { apiInstance } from 'Utilities/hooks/useQuery';

const DeletePolicy = () => {
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const { policy_id: policyId } = useParams();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('/scappolicies');
  };
  const { data: { data } = {}, error, loading } = usePolicy(policyId);

  const deletePolicy = async (id) => {
    try {
      await apiInstance.deletePolicy(id);
      dispatchAction(
        addNotification({
          variant: 'success',
          title: `Deleted "${data?.title}" and its associated reports`,
        })
      );
      onClose();
    } catch (e) {
      dispatchAction(
        addNotification({
          variant: 'danger',
          title: 'Error removing policy',
          description: e?.message,
        })
      );
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
          onClick={() => deletePolicy(data?.id)}
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
            Deleting the policy <b>{data?.title}</b> will also delete its
            associated reports.
          </Text>
          <Checkbox
            label="I understand this will delete the policy and all associated reports"
            id={`deleting-policy-check-${data?.id}`}
            isChecked={deleteEnabled}
            onChange={(_, v) => setDeleteEnabled(v)}
          />
        </StateViewPart>
      </StateViewWithError>
    </ComplianceModal>
  );
};

export default DeletePolicy;
