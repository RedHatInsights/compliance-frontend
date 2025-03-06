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
import usePolicy from 'Utilities/hooks/api/usePolicy';
import useAssignedRules from './hooks/useAssignedRules';
import useAssignedSystems from './hooks/useAssignedSystems';
import useSupportedProfiles from 'Utilities/hooks/api/useSupportedProfiles';

const EditPolicy = ({ route }) => {
  const navigate = useNavigate();
  const { policy_id: policyId } = useParams();
  const location = useLocation();
  const {
    data: { data: policy } = {},
    loading: policyLoading,
    error: policyError,
  } = usePolicy({ params: { policyId }, skip: policyId === undefined });

  const {
    data: { data: supportedProfiles } = {},
    error: supportedProfilesError,
    loading: supportedProfilesLoading,
  } = useSupportedProfiles({
    params: {
      filter: `os_major_version=${policy?.os_major_version}`,
      limit: 100,
    },
    skip: policyLoading || !policy?.os_major_version,
  });

  const securityGuide = supportedProfiles?.find(
    (profile) => profile.ref_id === policy?.ref_id
  );

  const supportedOsVersions = securityGuide?.os_minor_versions || [];

  const { assignedRuleIds, assignedRulesLoading } = useAssignedRules(policyId);
  const { assignedSystems, assignedSystemsLoading } = useAssignedSystems(
    policyId,
    policy,
    policyLoading
  );

  const [updatedPolicy, setUpdatedPolicy] = useState(null);

  const saveEnabled = !updatedPolicy;

  const onSaveCallback = (isClose) =>
    navigate(
      isClose ? `/scappolicies/${policyId}` : location.state?.returnTo || -1
    );

  const [isSaving, onSave] = useOnSave(policy, updatedPolicy, {
    onSave: onSaveCallback,
    onError: onSaveCallback,
  });

  const setRuleValues = (
    _policy,
    tailoring,
    valueDefinition,
    newValue,
    closeInlineEdit
  ) => {
    // tailoring might be an object or just a number (minor version for profile tab)
    const osMinorVersion = tailoring?.os_minor_version ?? tailoring;
    setUpdatedPolicy((prev) => {
      return {
        ...prev,
        tailoringValueOverrides: {
          ...prev?.tailoringValueOverrides,
          [osMinorVersion]: {
            ...tailoring?.value_overrides,
            ...prev?.tailoringValueOverrides?.[osMinorVersion],
            [valueDefinition.id]: newValue,
          },
        },
      };
    });

    closeInlineEdit();
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

  useTitleEntity(route, policy?.title);

  const statusValues = {
    data: policy && supportedProfiles && assignedRuleIds,
    loading:
      policyLoading ||
      supportedProfilesLoading ||
      assignedSystemsLoading ||
      assignedRulesLoading,
    error: policyError || supportedProfilesError,
  };

  return (
    <ComplianceModal
      isOpen
      position={'top'}
      style={{ minHeight: '350px' }}
      width={1220}
      variant={'large'}
      ouiaId="EditPolicyModal"
      title={`Edit ${policy?.title || ''}`}
      onClose={() => onSaveCallback(true)}
      actions={actions}
    >
      <StateViewWithError stateValues={statusValues}>
        <StateViewPart stateKey="loading">
          <Spinner />
        </StateViewPart>
        <StateViewPart stateKey="data">
          <EditPolicyForm
            {...{
              policy,
              updatedPolicy,
              setUpdatedPolicy,
              assignedRuleIds,
              assignedSystems,
              setRuleValues,
              supportedOsVersions,
              securityGuide,
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
