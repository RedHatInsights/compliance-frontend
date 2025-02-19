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

const difference = (arr1, arr2) => arr1.filter((x) => !arr2.includes(x));

export const EditPolicyRulesTab = ({
  policy,
  assignedRuleIds,
  setRuleValues,
  setUpdatedPolicy,
  selectedOsMinorVersions,
  selectedVersionCounts,
}) => {
  const [selectedRules, setSelectedRules] = useState(assignedRuleIds);
  const tailoringOsMinorVersions = Object.keys(assignedRuleIds).map(Number);
  const nonTailoringOsMinorVersions = selectedOsMinorVersions.filter(
    (version) => !tailoringOsMinorVersions.includes(version)
  );

  const shouldSkipProfiles =
    nonTailoringOsMinorVersions.length === 0 ||
    difference(nonTailoringOsMinorVersions, tailoringOsMinorVersions).length ===
      0;

  const {
    profilesAndRuleIds: profilesRuleIds,
    loading: profilesRuleIdsLoading,
    error: profilesRuleIdsError,
  } = useProfileRuleIds({
    profileRefId: policy.ref_id,
    osMajorVersion: policy.os_major_version,
    osMinorVersions: nonTailoringOsMinorVersions,
    skip: shouldSkipProfiles,
  });

  useEffect(() => {
    if (profilesRuleIds !== undefined && profilesRuleIdsLoading !== true) {
      profilesRuleIds.forEach((entry) => {
        if (!Object.keys(selectedRules).includes(`${entry.osMinorVersion}`)) {
          setUpdatedPolicy((prev) => ({
            ...prev,
            tailoringRules: {
              ...prev?.tailoringRules,
              [Number(entry.osMinorVersion)]: entry.ruleIds,
            },
          }));

          setSelectedRules((prev) => ({
            ...prev,
            [Number(entry.osMinorVersion)]: entry.ruleIds,
          }));
        }
      });
    }
  }, [
    profilesRuleIds,
    profilesRuleIdsLoading,
    selectedRules,
    setUpdatedPolicy,
  ]);

  const handleSelect = useCallback(
    (policy, tailoring, newSelectedRuleIds) => {
      setUpdatedPolicy((prev) => ({
        ...prev,
        tailoringRules: {
          ...prev?.tailoringRules,
          [tailoring.os_minor_version]: newSelectedRuleIds,
        },
      }));

      setSelectedRules((prev) => ({
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
        data:
          policy &&
          selectedOsMinorVersions.length > 0 &&
          (shouldSkipProfiles || (profilesRuleIds && !profilesRuleIdsLoading)),
        loading:
          assignedSystemCount === undefined ||
          (nonTailoringOsMinorVersions.length > 0 && profilesRuleIdsLoading),
        empty: selectedOsMinorVersions.length === 0,
        error: profilesRuleIdsError, // TODO: add the state view for error
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
          profiles={profilesRuleIds}
          resetLink
          rulesPageLink
          selectedFilter
          remediationsEnabled={false}
          columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
          level={1}
          ouiaId="RHELVersions"
          onValueOverrideSave={setRuleValues}
          onSelect={handleSelect}
          preselected={selectedRules}
          enableSecurityGuideRulesToggle
          selectedVersionCounts={selectedVersionCounts}
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
  setRuleValues: propTypes.func,
  setUpdatedPolicy: propTypes.func,
  selectedOsMinorVersions: propTypes.array,
  selectedVersionCounts: propTypes.object,
};

export default EditPolicyRulesTab;
