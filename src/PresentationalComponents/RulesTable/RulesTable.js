import React, { useState, useMemo } from 'react';
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
import { growTableTree, itemIdentifier } from './helpers';

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
  showFailedCounts = false,
  setRuleValues,
  ruleValues,
  onRuleValueReset,
  ...rulesTableProps
}) => {
  const internalSelectedState = useState([]);
  const [selectedRules, setSelectedRules] = handleSelect
    ? [selectedRulesProp, handleSelect]
    : internalSelectedState;
  const rules = toRulesArrayWithProfile(profileRules);
  const selectedRulesWithRemediations = (selectedRules) =>
    (selectedRules || []).filter((rule) => rule.remediationAvailable);
  const showRuleStateFilter =
    columns.filter((c) => c.title === 'Rule state').length > 0;

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

  const DetailsRow = useMemo(
    () =>
      function Row(props) {
        return (
          <RuleDetailsRow
            onValueChange={setRuleValues}
            onRuleValueReset={onRuleValueReset}
            {...props}
          />
        );
      },
    [setRuleValues]
  );

  return (
    <TableToolsTable
      aria-label="Rules Table"
      items={rules}
      columns={columns}
      isStickyHeader
      filters={{
        filterConfig: buildFilterConfig({
          showRuleStateFilter,
          policies,
          ansibleSupportFilter,
        }),
        ...(hidePassed && {
          activeFilters: (currentActiveFilters) => ({
            ...currentActiveFilters,
            ['rule-state']: currentActiveFilters['rule-state']
              ? currentActiveFilters['rule-state']
              : ['failed'],
            ...activeFilters,
          }),
        }),
      }}
      options={{
        ...COMPLIANCE_TABLE_DEFAULTS,
        ...options,
        tableTree: growTableTree(
          profileRules[0].profile,
          rules,
          showFailedCounts
        ),
        identifier: itemIdentifier,
        onSelect: (handleSelect || remediationsEnabled) && setSelectedRules,
        preselected: selectedRules,
        detailsComponent: DetailsRow,
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
  showFailedCounts: propTypes.number,
  setRuleValues: propTypes.func,
  ruleValues: propTypes.object,
  onRuleValueReset: propTypes.func,
};

export default RulesTable;
