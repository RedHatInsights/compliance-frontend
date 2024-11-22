import React, { useCallback, useEffect, useState } from 'react';
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

export const EditPolicyRulesTab = ({
  policy,
  assignedRuleIds,
  setRuleValues,
  setUpdatedPolicy,
  selectedOsMinorVersions,
}) => {
  const [selectedTailoringRules, setSelectedTailoringRules] =
    useState(assignedRuleIds);

  const nonTailoringOsMinorVersions = selectedOsMinorVersions.filter(
    (version) => !Object.keys(assignedRuleIds).map(Number).includes(version)
  );

  const {
    profilesAndRuleIds,
    loading: preselectedRuleIdsLoading,
    error: preselectedRuleIdsError,
  } = useProfileRuleIds({
    profileRefId: policy.ref_id,
    osMajorVersion: policy.os_major_version,
    osMinorVersions: nonTailoringOsMinorVersions,
    skip: nonTailoringOsMinorVersions.length === 0,
  });

  useEffect(() => {
    if (
      profilesAndRuleIds !== undefined &&
      preselectedRuleIdsLoading !== true
    ) {
      profilesAndRuleIds.forEach((entry) => {
        setUpdatedPolicy((prev) => ({
          ...prev,
          tailoringRules: {
            ...prev?.tailoringRules,
            [entry.profileId]: entry.ruleIds,
          },
        }));

        setSelectedTailoringRules((prev) => ({
          ...prev,
          [entry.osMinorVersion]: entry.ruleIds,
        }));
      });
    }
  }, [profilesAndRuleIds, preselectedRuleIdsLoading, setUpdatedPolicy]);

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
          (nonTailoringOsMinorVersions.length !== 0 &&
            preselectedRuleIdsLoading),
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
  assignedRuleIds: propTypes.array,
  setSelectedRuleRefIds: propTypes.func,
  setRuleValues: propTypes.func,
  setUpdatedPolicy: propTypes.func,
  selectedOsMinorVersions: propTypes.array,
};

export default EditPolicyRulesTab;
