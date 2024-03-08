import React from 'react';
import propTypes from 'prop-types';
import { Button, Spinner } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import {
  ComplianceModal,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';

const ModalFormTemplate = ({
  formFields,
  policy,
  isSaving,
  onClose,
  loading,
  error,
}) => {
  const { handleSubmit } = useFormApi();

  const actions = [
    <Button
      isDisabled={false}
      key="save"
      ouiaId="EditPolicySaveButton"
      variant="primary"
      spinnerAriaValueText="Saving"
      isLoading={isSaving}
      onClick={handleSubmit}
    >
      Save
    </Button>,
    <Button
      key="cancel"
      ouiaId="EditPolicyCancelButton"
      variant="link"
      onClick={onClose}
    >
      Cancel
    </Button>,
  ];

  return (
    <ComplianceModal
      isOpen
      position={'top'}
      style={{ minHeight: '350px' }}
      width={1220}
      variant={'large'}
      ouiaId="EditPolicyModal"
      title={`Edit ${policy ? policy.name : ''}`}
      onClose={onClose}
      actions={actions}
    >
      <StateViewWithError
        stateValues={{
          data: policy && !loading,
          loading: loading && !policy,
          error: error,
        }}
      >
        <StateViewPart stateKey="data">{formFields}</StateViewPart>
        <StateViewPart stateKey="loading">
          <Spinner />
        </StateViewPart>
      </StateViewWithError>
    </ComplianceModal>
  );
};

ModalFormTemplate.propTypes = {
  formFields: propTypes.array,
  policy: propTypes.object,
  isSaving: propTypes.bool,
  onClose: propTypes.func,
  loading: propTypes.bool,
  error: propTypes.oneOfType([propTypes.bool, propTypes.object]),
};

export default ModalFormTemplate;
