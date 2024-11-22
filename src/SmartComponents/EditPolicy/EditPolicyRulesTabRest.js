import React, { useCallback, useState } from 'react';
import {
  EmptyState,
  EmptyStateBody,
  Text,
  TextContent,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import { StateView, StateViewPart } from 'PresentationalComponents';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import Tailorings from '@/PresentationalComponents/Tailorings/Tailorings';
import useProfileRuleIds from '../CreatePolicy/EditPolicyProfilesRules/useProfileRuleIds';

const EditPolicyRulesTabEmptyState = () => (
  <EmptyState>
    <EmptyStateHeader
      titleText="No rules can be configured"
      headingLevel="h5"
    />
    <EmptyStateBody>
      This policy has no associated systems, and therefore no rules can be
      configured.
    </EmptyStateBody>
    <EmptyStateFooter>
      <EmptyStateBody>
        Add at least one system to configure rules for this policy.
      </EmptyStateBody>
    </EmptyStateFooter>
  </EmptyState>
);

const difference = (arr1, arr2) => arr1.filter((x) => !arr2.includes(x));

export const EditPolicyRulesTab = ({
  policy,
  selectedRuleRefIds,
  setRuleValues,
  setUpdatedPolicy,
  selectedOsMinorVersions,
}) => {
  const [selectedTailoringRules, setSelectedTailoringRules] =
    useState(selectedRuleRefIds);

  const skipFetchingProfileRuleIds =
    difference(
      selectedOsMinorVersions,
      Object.keys(selectedRuleRefIds).map(Number)
    ).length === 0;

  const {
    profilesAndRuleIds,
    loading: preselectedRuleIdsLoading,
    error: preselectedRuleIdsError,
  } = useProfileRuleIds({
    profileRefId: policy.ref_id,
    osMajorVersion: policy.os_major_version,
    osMinorVersions: selectedOsMinorVersions,
    skip: skipFetchingProfileRuleIds,
  });

  const handleSelect = useCallback(
    (policy, tailoring, newSelectedRuleIds) => {
      setUpdatedPolicy((prev) => ({
        ...prev,
        tailoringRules: {
          ...prev?.tailoringRules,
          [tailoring.id]: newSelectedRuleIds,
        },
      }));

      setSelectedTailoringRules((prev) => ({
        ...prev,
        [tailoring.os_minor_version]: newSelectedRuleIds,
      }));
    },
    [setUpdatedPolicy]
  );

  const assignedSystemCount = policy?.total_system_count;
  return (
    <StateView
      stateValues={{
        data: policy && assignedSystemCount,
        loading:
          assignedSystemCount === undefined ||
          (skipFetchingProfileRuleIds && preselectedRuleIdsLoading),
        empty: assignedSystemCount === 0,
        error: preselectedRuleIdsError, // TODO: add the state view for error
      }}
    >
      <StateViewPart stateKey="loading">
        <EmptyState>
          <Spinner />
        </EmptyState>
      </StateViewPart>
      <StateViewPart stateKey="data">
        <TextContent>
          <Text>
            Different release versions of RHEL are associated with different
            versions of the SCAP Security Guide (SSG), therefore each release
            must be customized independently.
          </Text>
        </TextContent>
        <Tailorings
          policy={policy}
          profiles={profilesAndRuleIds}
          resetLink
          rulesPageLink
          selectedFilter
          remediationsEnabled={false}
          columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
          level={1}
          ouiaId="RHELVersions"
          onValueOverrideSave={setRuleValues}
          onSelect={handleSelect}
          preselected={selectedTailoringRules}
          enableSecurityGuideRulesToggle
        />
      </StateViewPart>
      <StateViewPart stateKey="empty">
        <EditPolicyRulesTabEmptyState />
      </StateViewPart>
    </StateView>
  );
};

EditPolicyRulesTab.propTypes = {
  policy: propTypes.object,
  selectedRuleRefIds: propTypes.array,
  setSelectedRuleRefIds: propTypes.func,
  setRuleValues: propTypes.func,
  setUpdatedPolicy: propTypes.func,
  selectedOsMinorVersions: propTypes.array,
};

export default EditPolicyRulesTab;
