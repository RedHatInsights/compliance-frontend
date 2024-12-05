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
  Bullseye,
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
import usePolicy from 'Utilities/hooks/api/usePolicy';
import useAPIV2FeatureFlag from 'Utilities/hooks/useAPIV2FeatureFlag';
import { apiInstance } from 'Utilities/hooks/useQuery';
import dataSerialiser from 'Utilities/dataSerialiser';
import { dataMap } from './constants';

const DeletePolicyBase = ({ query, deletePolicy, onClose }) => {
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const { data, error, loading } = query;
  const {
    profile: { name, id },
  } = data || { profile: {} };

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
          onClick={() => deletePolicy(id)}
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
            onChange={(_, v) => setDeleteEnabled(v)}
          />
        </StateViewPart>
      </StateViewWithError>
    </ComplianceModal>
  );
};

DeletePolicyBase.propTypes = {
  query: propTypes.shape({
    loading: propTypes.bool,
    error: propTypes.object,
    data: propTypes.object,
  }),
  onClose: propTypes.func,
  deletePolicy: propTypes.func,
};

const DeletePolicyRest = ({ policyId, onClose }) => {
  const query = usePolicy(policyId);

  const data = query.data?.data
    ? dataSerialiser(query.data.data, dataMap)
    : undefined;

  const deletePolicy = async (id) => {
    try {
      await apiInstance.deletePolicy(id);
      dispatchAction(
        addNotification({
          variant: 'success',
          title: `Deleted "${query.data?.data?.title}" and its associated reports`,
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
    <DeletePolicyBase
      query={{ ...query, data }}
      deletePolicy={deletePolicy}
      onClose={onClose}
    />
  );
};

DeletePolicyRest.propTypes = {
  policyId: propTypes.string,
  onClose: propTypes.func,
};

const DeletePolicyGraphQL = ({ policyId, onClose }) => {
  const query = usePolicyQuery({
    policyId,
    minimal: true,
  });

  const [callDeletePolicy] = useMutation(DELETE_PROFILE, {
    onCompleted: () => {
      dispatchAction(
        addNotification({
          variant: 'success',
          title: `Deleted "${query.data?.profile?.name}" and its associated reports`,
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

  const deletePolicy = (id) => {
    callDeletePolicy({ variables: { input: { id } } });
  };

  return (
    <DeletePolicyBase
      query={query}
      deletePolicy={deletePolicy}
      onClose={onClose}
    />
  );
};

DeletePolicyGraphQL.propTypes = {
  policyId: propTypes.string,
  onClose: propTypes.func,
};

const DeletePolicyWrapper = () => {
  const { policy_id: policyId } = useParams();
  const apiV2Enabled = useAPIV2FeatureFlag();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('/scappolicies');
  };

  if (apiV2Enabled === undefined) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  const DeletePolicy = apiV2Enabled ? DeletePolicyRest : DeletePolicyGraphQL;

  return <DeletePolicy policyId={policyId} onClose={onClose} />;
};

export default DeletePolicyWrapper;
