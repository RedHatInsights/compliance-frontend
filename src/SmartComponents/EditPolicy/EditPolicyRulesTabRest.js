import React, { useEffect, useState } from 'react';
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
import { StateViewWithError, StateViewPart } from 'PresentationalComponents';
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
}) => {
  const [selectedRules, setSelectedRules] = useState(selectedRuleRefIds);
  console.log(selectedRules, 'debug: selected rules');
  return (
    <div>
      <TextContent>
        <Text>
          Different release versions of RHEL are associated with different
          versions of the SCAP Security Guide (SSG), therefore each release must
          be customized independently.
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
        handleSelect={(selectedItems) => {
          setSelectedRules(selectedItems);
        }}
        selectedRules={selectedRules}
      />
    </div>
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
};

export default EditPolicyRulesTab;
