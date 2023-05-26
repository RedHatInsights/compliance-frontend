import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Button, Spinner } from '@patternfly/react-core';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import {
  ComplianceModal,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import EditPolicyForm from './EditPolicyForm';
import { useOnSave, useLinkToPolicy } from './hooks';
import usePolicyQueries from './hooks/usePolicyQueries.js';

export const EditPolicy = ({ route }) => {
  const { policy, loading, error } = usePolicyQueries();

  const linkToPolicy = useLinkToPolicy();
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
  const [isSaving, onSave] = useOnSave(policy, updatedPolicyHostsAndRules);

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
      onClick={() => linkToPolicy()}
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
      variant={'large'}
      ouiaId="EditPolicyModal"
      title={`Edit ${policy ? policy.name : ''}`}
      onClose={() => linkToPolicy()}
      actions={actions}
    >
      <StateViewWithError stateValues={{ policy, loading, error }}>
        <StateViewPart stateKey="loading">
          <Spinner />
        </StateViewPart>
        <StateViewPart stateKey="policy">
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
