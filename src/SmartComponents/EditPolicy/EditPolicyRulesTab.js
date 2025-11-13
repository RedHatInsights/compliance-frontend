import React, { useCallback, useState } from 'react';
import {
  EmptyState,
  EmptyStateBody,
  Content,
  EmptyStateFooter,
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import xor from 'lodash/xor';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import { StateView, StateViewPart } from 'PresentationalComponents';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import Tailorings from '@/PresentationalComponents/Tailorings/Tailorings';
import useProfileRuleIds from '../CreatePolicy/EditPolicyProfilesRules/useProfileRuleIds';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import useDeepCompareEffect from 'use-deep-compare-effect';

const EditPolicyRulesTabEmptyState = () => (
  <EmptyState headingLevel="h5" titleText="No rules can be configured">
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
  updatedPolicy,
  selectedOsMinorVersions,
  selectedVersionCounts,
}) => {
  const [selectedRules, setSelectedRules] = useState(assignedRuleIds);

  const tailoringOsMinorVersions = Object.keys(assignedRuleIds).map(Number);
  const nonTailoringOsMinorVersions = selectedOsMinorVersions.filter(
    (version) => !tailoringOsMinorVersions.includes(version),
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

  const additionalRules = Object.fromEntries(
    Object.entries(selectedRules || {}).reduce(
      (additions, [osMinorVersion, rules]) => [
        ...additions,
        [
          osMinorVersion,
          xor(rules, [
            ...(assignedRuleIds[osMinorVersion] || []),
            ...(profilesRuleIds?.find(
              (profile) =>
                Number(profile.osMinorVersion) === Number(osMinorVersion),
            )?.ruleIds || []),
          ]),
        ],
      ],
      [],
    ),
  );

  const { data: { data: tailoringsData } = {} } = useTailorings({
    params: {
      policyId: policy.id,
      filter: 'NOT(null? os_minor_version)',
    },
  });

  useDeepCompareEffect(() => {
    setUpdatedPolicy((prev) => {
      return {
        ...prev,
        tailoringRules: selectedRules,
        tailoringValueOverrides: {
          ...prev?.tailoringValueOverrides,
          ...tailoringsData?.reduce((overrides, tailoring) => {
            return {
              ...overrides,
              [tailoring.os_minor_version]: {
                ...tailoring.value_overrides,
                ...prev?.tailoringValueOverrides?.[tailoring.os_minor_version],
              },
            };
          }, {}),
        },
      };
    });
    setSelectedRules((prev) => ({
      ...prev,
      ...profilesRuleIds?.reduce((prevRuleIds, profile) => {
        return {
          ...prevRuleIds,
          [Number(profile.osMinorVersion)]:
            prev?.[profile.osMinorVersion].length > 0
              ? prev?.[profile.osMinorVersion]
              : profile.ruleIds,
        };
      }, {}),
    }));
  }, [
    profilesRuleIds,
    profilesRuleIdsLoading,
    selectedRules,
    setUpdatedPolicy,
    tailoringsData,
  ]);

  const handleSelect = useCallback(
    (_policy, tailoring, newSelectedRuleIds) => {
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
    [setUpdatedPolicy],
  );

  const assignedSystemCount = policy?.total_system_count;
  return (
    <StateView
      stateValues={{
        data:
          policy &&
          (selectedOsMinorVersions.length > 0 ||
            tailoringOsMinorVersions.length > 0) &&
          (shouldSkipProfiles || (profilesRuleIds && !profilesRuleIdsLoading)),
        loading:
          assignedSystemCount === undefined ||
          (nonTailoringOsMinorVersions.length > 0 && profilesRuleIdsLoading),
        empty:
          selectedOsMinorVersions.length === 0 &&
          tailoringOsMinorVersions.length === 0,
        error: profilesRuleIdsError, // TODO: add the state view for error
      }}
    >
      <StateViewPart stateKey="loading">
        <EmptyState>
          <Spinner />
        </EmptyState>
      </StateViewPart>
      <StateViewPart stateKey="data">
        <Content>
          <Content component="p">
            Different release versions of RHEL are associated with different
            versions of the SCAP Security Guide (SSG), therefore each release
            must be customized independently.
          </Content>
        </Content>
        <Tailorings
          policy={policy}
          profiles={profilesRuleIds}
          rulesPageLink
          remediationsEnabled={false}
          columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
          level={1}
          ouiaId="RHELVersions"
          onValueOverrideSave={setRuleValues}
          valueOverrides={updatedPolicy?.tailoringValueOverrides}
          onSelect={handleSelect}
          showResetButton
          selected={selectedRules}
          additionalRules={additionalRules}
          enableSecurityGuideRulesToggle
          selectedVersionCounts={selectedVersionCounts}
          skipProfile="edit-policy"
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
  updatedPolicy: propTypes.object,
  selectedOsMinorVersions: propTypes.array,
  selectedVersionCounts: propTypes.object,
};

export default EditPolicyRulesTab;
