import {
  Button,
  Checkbox,
  Modal,
  ModalVariant,
  Text,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { DELETE_PROFILE } from 'Mutations';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { dispatchAction } from 'Utilities/Dispatcher';

const DeletePolicy = () => {
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const { name, id } = location.state.policy;
  const onClose = () => {
    history.push('/scappolicies');
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
    <Modal
      variant={ModalVariant.small}
      title={
        <React.Fragment>
          <ExclamationTriangleIcon className="ins-u-warning" />
          <Text component="span" className="policy-delete-header-text">
            Delete policy?
          </Text>
        </React.Fragment>
      }
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
    </Modal>
  );
};

DeletePolicy.propTypes = {
  policy: propTypes.object,
};

export default DeletePolicy;
