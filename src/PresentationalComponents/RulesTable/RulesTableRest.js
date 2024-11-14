import React, { useState, useMemo } from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_TABLE_DEFAULTS } from '@/constants';
import RemediationButton from 'PresentationalComponents/ComplianceRemediationButton/RemediationButtonRest';
import { ComplianceTable } from 'PresentationalComponents';
import RuleDetailsRow from './RuleDetailsRow';
import buildFilterConfig from './Filters';
import defaultColumns from './Columns';

const RulesTable = ({
  system,
  rules,
  ruleTree,
  policyId,
  policyName,
  columns = defaultColumns,
  remediationsEnabled = true,
  ansibleSupportFilter = false,
  selectedFilter = false,
  selectedRules: selectedRulesProp = [],
  hidePassed = false,
  options,
  activeFilters,
  // showFailedCounts = false, // TODO We need systems counts
  setRuleValues,
  ruleValues,
  valueDefinitions,
  onRuleValueReset,
  DedicatedAction,
  onValueOverrideSave,
  total,
  onSelect,
  defaultTableView = 'tree',
  reportTestResult,
  ...rulesTableProps
}) => {
  const internalSelectedState = useState([]);
  const [selectedRules, setSelectedRules] =
    typeof onSelect === 'function'
      ? [selectedRulesProp, onSelect]
      : internalSelectedState;
  const showRuleStateFilter =
    columns.filter((c) => c.title === 'Rule state').length > 0;

  // TODO implement policies filter
  const policies = [];

  const remediationAction = () => (
    <RemediationButton
      reportTestResults={selectedRules.length > 0 ? [reportTestResult] : []}
      selectedRuleResultIds={selectedRules}
      reportId={policyId}
    />
  );

  const DetailsRow = useMemo(
    () =>
      function Row(props) {
        // eslint-disable-next-line react/prop-types
        const rule = rules?.find(({ id }) => props?.item?.itemId === id);
        const ruleValueDefinitions = rule?.value_checks?.map((checkId) =>
          valueDefinitions?.find(({ id }) => id === checkId)
        );
        const ruleRuleValues = ruleValues
          ? Object.fromEntries(
              Object.entries(ruleValues).filter(([id]) =>
                rule?.value_checks.includes(id)
              )
            )
          : undefined;
        const item = {
          // eslint-disable-next-line react/prop-types
          ...props.item,
          ...rule,
          valueDefinitions: ruleValueDefinitions,
          profile: { id: policyId, name: policyName },
          ruleValues: ruleRuleValues,
        };

        return (
          <RuleDetailsRow
            onValueChange={onValueOverrideSave}
            onRuleValueReset={onRuleValueReset}
            item={item}
          />
        );
      },
    /* eslint-enable */
    [
      policyId,
      policyName,
      onRuleValueReset,
      rules,
      valueDefinitions,
      ruleValues,
      onValueOverrideSave,
    ]
  );

  return (
    <ComplianceTable
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
          activeFilters: (currentActiveFilters = {}) => ({
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
        showViewToggle: true,
        defaultTableView,
        ...(ruleTree ? { tableTree: ruleTree } : {}),
        ...(onSelect ? { onSelect: setSelectedRules } : {}),
        preselected: selectedRules,
        detailsComponent: DetailsRow,
        selectedFilter,
        dedicatedAction: DedicatedAction,
        ...(remediationsEnabled ? { dedicatedAction: remediationAction } : {}),
        total,
      }}
      total={total}
      {...rulesTableProps}
    />
  );
};

RulesTable.propTypes = {
  profileRules: propTypes.array,
  rules: propTypes.array.isRequired,
  ruleTree: propTypes.array,
  policyId: propTypes.string.isRequired,
  policyName: propTypes.string,
  loading: propTypes.bool,
  hidePassed: propTypes.bool,
  system: propTypes.object,
  remediationsEnabled: propTypes.bool,
  ansibleSupportFilter: propTypes.bool,
  selectedRules: propTypes.array,
  selectedFilter: propTypes.bool,
  columns: propTypes.array,
  options: propTypes.object,
  activeFilters: propTypes.object,
  showFailedCounts: propTypes.number,
  setRuleValues: propTypes.func,
  ruleValues: propTypes.object,
  onRuleValueReset: propTypes.func,
  DedicatedAction: propTypes.node,
  valueDefinitions: propTypes.object.isRequired,
  onValueOverrideSave: propTypes.func,
  onSelect: propTypes.oneOf([propTypes.func, propTypes.bool]),
  total: propTypes.number,
  defaultTableView: propTypes.string,
  reportTestResult: propTypes.object,
};

export default RulesTable;
