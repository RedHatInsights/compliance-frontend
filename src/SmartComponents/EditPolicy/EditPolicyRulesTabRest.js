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
import { Tailorings } from 'PresentationalComponents';

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
  selectedRuleRefIds,
  setRuleValues,
  setUpdatedPolicy,
}) => {
  const [selectedTailoringRules, setSelectedTailoringRules] =
    useState(selectedRuleRefIds);

  const handleSelect = useCallback(
    (selectedItems) => {
      setUpdatedPolicy((prev) => ({
        ...prev,
        tailoringRules: {
          ...(prev?.tailoringRules || {}),
          ...selectedItems,
        },
      }));

      setSelectedTailoringRules(selectedItems);
    },
    [setUpdatedPolicy]
  );

  const assignedSystemCount = policy?.total_system_count;
  return (
    <StateView
      stateValues={{
        data: policy && assignedSystemCount,
        loading: assignedSystemCount === undefined,
        empty: assignedSystemCount === 0,
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
          resetLink
          rulesPageLink
          selectedFilter
          remediationsEnabled={false}
          columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
          level={1}
          ouiaId="RHELVersions"
          onValueOverrideSave={setRuleValues}
          handleSelect={handleSelect}
          selectedRules={selectedTailoringRules}
        />
      </StateViewPart>
      <StateViewPart stateKey="empty">
        <EditPolicyRulesTabEmptyState />
      </StateViewPart>
    </StateView>
  );
};

EditPolicyRulesTab.propTypes = {
  setNewRuleTabs: propTypes.func,
  policy: propTypes.object,
  osMinorVersionCounts: propTypes.shape({
    osMinorVersion: propTypes.shape({
      osMinorVersion: propTypes.number,
      count: propTypes.number,
    }),
  }),
  selectedRuleRefIds: propTypes.array,
  setSelectedRuleRefIds: propTypes.func,
  setRuleValues: propTypes.func,
  ruleValues: propTypes.array,
  setUpdatedPolicy: propTypes.func,
};

export default EditPolicyRulesTab;
