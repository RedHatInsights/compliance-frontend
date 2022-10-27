import React, { useState } from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_TABLE_DEFAULTS } from '@/constants';
// eslint-disable-next-line
import ComplianceRemediationButton from 'PresentationalComponents/ComplianceRemediationButton';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import { toRulesArrayWithProfile } from 'Utilities/ruleHelpers';
import RuleDetailsRow from './RuleDetailsRow';
import emptyRows from './EmptyRows';
import buildFilterConfig from './Filters';
import defaultColumns from './Columns';

const RulesTable = ({
  system,
  profileRules,
  columns = defaultColumns,
  remediationsEnabled = true,
  ansibleSupportFilter = false,
  selectedFilter = false,
  handleSelect,
  selectedRules: selectedRulesProp = [],
  hidePassed = false,
  options,
  activeFilters,
  ...rulesTableProps
}) => {
  const [selectedRules, setSelectedRules] = handleSelect
    ? [selectedRulesProp, handleSelect]
    : useState([]);
  const rules = toRulesArrayWithProfile(profileRules);
  const selectedRulesWithRemediations = (selectedRules) =>
    (selectedRules || []).filter((rule) => rule.remediationAvailable);
  const showPassFailFilter =
    columns.filter((c) => c.title === 'Passed').length > 0;
  const policies = profileRules
    .filter(({ profile }) => !!profile)
    .map(({ profile }) => ({
      id: profile.id,
      name: profile.name,
    }));

  const remediationAction = ({ selected }) => (
    <ComplianceRemediationButton
      allSystems={selected.length > 0 ? [system] : undefined}
      selectedRules={selectedRulesWithRemediations(selected)}
    />
  );

  return (
    <TableToolsTable
      aria-label="Rules Table"
      items={rules}
      columns={columns}
      isStickyHeader
      filters={{
        filterConfig: buildFilterConfig({
          showPassFailFilter,
          policies,
          ansibleSupportFilter,
        }),
        ...(hidePassed && {
          activeFilters: (currentActiveFilters) => ({
            ...currentActiveFilters,
            passed: currentActiveFilters.passed
              ? currentActiveFilters.passed
              : ['failed'],
            ...activeFilters,
          }),
        }),
      }}
      options={{
        ...COMPLIANCE_TABLE_DEFAULTS,
        ...options,
        identifier: (item) => `${item.profile.id}|${item.refId}`,
        onSelect: (handleSelect || remediationsEnabled) && setSelectedRules,
        preselected: selectedRules,
        detailsComponent: RuleDetailsRow,
        emptyRows: emptyRows(columns),
        selectedFilter,
        ...(remediationsEnabled ? { dedicatedAction: remediationAction } : {}),
      }}
      {...rulesTableProps}
    />
  );
};

RulesTable.propTypes = {
  profileRules: propTypes.array,
  loading: propTypes.bool,
  hidePassed: propTypes.bool,
  system: propTypes.object,
  remediationsEnabled: propTypes.bool,
  ansibleSupportFilter: propTypes.bool,
  selectedRules: propTypes.array,
  selectedFilter: propTypes.bool,
  handleSelect: propTypes.func,
  columns: propTypes.array,
  options: propTypes.object,
  activeFilters: propTypes.object,
};

export default RulesTable;
