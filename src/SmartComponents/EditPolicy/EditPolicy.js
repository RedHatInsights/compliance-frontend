import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Button, Spinner } from '@patternfly/react-core';
import { useLocation, useParams } from 'react-router-dom';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import {
  ComplianceModal,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import EditPolicyForm from './EditPolicyForm';
import { useOnSave } from './hooks';
import usePolicyQuery from 'Utilities/hooks/usePolicyQuery';

export const EditPolicy = ({ route }) => {
  const navigate = useNavigate();
  const { policy_id: policyId } = useParams();
  const location = useLocation();
  const { data, error, loading } = usePolicyQuery({ policyId });
  const policy = data?.profile;
  const [updatedPolicy, setUpdatedPolicy] = useState(null);
  const [selectedRuleRefIds, setSelectedRuleRefIds] = useState([]);
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [ruleValues, setRuleValuesState] = useState({});

  const saveEnabled = updatedPolicy && !updatedPolicy.complianceThresholdValid;
  const updatedPolicyHostsAndRules = {
    ...updatedPolicy,
    selectedRuleRefIds,
    hosts: selectedSystems,
    values: ruleValues,
  };
  const onSaveCallback = (isClose) =>
    navigate(
      isClose ? `/scappolicies/${policyId}` : location.state?.returnTo || -1
    );

  const [isSaving, onSave] = useOnSave(policy, updatedPolicyHostsAndRules, {
    onSave: onSaveCallback,
    onError: onSaveCallback,
  });

  const setRuleValues = (policyId, valueDefinition, valueValue) => {
    const existingValues = Object.fromEntries(
      policy?.policy.profiles.map((profile) => {
        return [profile.id, profile.values];
      }) || []
    );

    setRuleValuesState((currentValues) => ({
      ...existingValues,
      ...currentValues,
      [policyId]: {
        ...existingValues[policyId],
        ...currentValues[policyId],
        [valueDefinition.id]: valueValue,
      },
    }));
  };

  const actions = [
    <Button
      isDisabled={saveEnabled}
      key="save"
      ouiaId="EditPolicySaveButton"
      variant="primary"
      spinnerAriaValueText="Saving"
      isLoading={isSaving}
      onClick={onSave}
    >
      Save
    </Button>,
    <Button
      key="cancel"
      ouiaId="EditPolicyCancelButton"
      variant="link"
      onClick={() => onSaveCallback(true)}
    >
      Cancel
    </Button>,
  ];

  useTitleEntity(route, policy?.name);

  return (
    <ComplianceModal
      isOpen
      position={'top'}
      style={{ minHeight: '350px' }}
      width={1220}
      variant={'large'}
      ouiaId="EditPolicyModal"
      title={`Edit ${policy ? policy.name : ''}`}
      onClose={() => onSaveCallback(true)}
      actions={actions}
    >
      <StateViewWithError
        stateValues={{ data: policy && !loading, loading, error }}
      >
        <StateViewPart stateKey="loading">
          <Spinner />
        </StateViewPart>
        <StateViewPart stateKey="data">
          <EditPolicyForm
            {...{
              policy,
              updatedPolicy,
              setUpdatedPolicy,
              selectedRuleRefIds,
              setSelectedRuleRefIds,
              selectedSystems,
              setSelectedSystems,
              setRuleValues,
              ruleValues,
            }}
          />
        </StateViewPart>
      </StateViewWithError>
    </ComplianceModal>
  );
};

EditPolicy.propTypes = {
  route: propTypes.object,
};

export default EditPolicy;
