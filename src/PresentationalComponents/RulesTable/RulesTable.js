import React, { useState, useMemo } from 'react';
import propTypes from 'prop-types';
import { Skeleton } from '@patternfly/react-core';
import { COMPLIANCE_TABLE_DEFAULTS } from '@/constants';
import { ComplianceRemediationButton } from 'PresentationalComponents';
import { ComplianceTable } from 'PresentationalComponents';
import RuleDetailsRow from './RuleDetailsRow';
import buildFilterConfig from './Filters';
import defaultColumns from './Columns';

/**
 * A component to show rules of a policy or test result.
 *
 *  @param   {object}             [props]                      React component props
 *  @param   {Array}              props.columns                A set of RulesTable columns
 *  @param   {Array}              [props.rules]                A set of rules (for the current page to show)
 *  @param   {number}             [props.total]                The overall total number of rules available to go through
 *  @param   {object}             [props.ruleTree]             A table tree to show the rules in. If provided it will enable the "table view" toggle
 *  @param   {string}             [props.policyId]             A policy ID used for remediations and as profile for rules
 *  @param   {string}             [props.policyName]           A policy name used in the profile of rule items
 *  @param   {object}             [props.reportTestResult]     A report test result used for the remediatons button
 *  @param   {boolean}            [props.remediationsEnabled]  Enables the "RemediationButton"
 *  @param   {boolean}            [props.ansibleSupportFilter] Enables the ansible filter
 *  @param   {boolean}            [props.selectedFilter]       Enables the "Selected Only" filter
 *  @param   {Array}              [props.selectedRules]        An array of rule IDs currently selected
 *  @param   {boolean}            [props.hidePassed]           Enables a default filter to only show failed rules.
 *  @param   {object}             [props.options ]             AsyncTableTools options
 *  @param   {boolean}            [props.activeFiltersPassed]  Enable Default filter
 *  @param   {string}             [props.activeFilters]        Default filter
 *  @param   {object}             [props.ruleValues]           An object of values to show for certain rule values
 *  @param   {Array}              [props.valueDefinitions]     An array of value definitons available for rules in the table
 *  @param   {boolean}            [props.skipValueDefinitions] TODO
 *  @param   {Function}           [props.onRuleValueReset]     A function called when a rule value is reset
 *  @param   {React.ReactElement} [props.DedicatedAction]      A dedicated action to show in the table
 *  @param   {object}             [props.valueOverrides]       An object of rule values // TODO we should make the name of this more consistent
 *  @param   {Function}           [props.onValueOverrideSave]  A funciton called when a value is saved
 *  @param   {Function}           [props.onSelect]             A function called when a selection action is performed
 *  @param   {string}             [props.defaultTableView]     A table view to show by default ("row" or "tree") // TODO we should use the table options directly
 *
 *  @returns {React.ReactElement}
 *
 *  @category Compliance
 *
 */
const RulesTable = ({
  rules,
  ruleTree,
  policyId,
  policyName,
  columns = defaultColumns,
  remediationsEnabled = true,
  ansibleSupportFilter = false,
  selectedFilter = false, // TODO this is potentially obsolete.
  selectedRules: selectedRulesProp = [],
  hidePassed = false,
  options,
  activeFiltersPassed = false,
  activeFilters,
  ruleValues,
  valueDefinitions,
  skipValueDefinitions,
  onRuleValueReset,
  DedicatedAction,
  onValueOverrideSave,
  total,
  onSelect,
  defaultTableView = 'tree',
  reportTestResult,
  valueOverrides,
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
    <ComplianceRemediationButton
      reportTestResults={selectedRules.length > 0 ? [reportTestResult] : []}
      selectedRuleResultIds={selectedRules}
      reportId={policyId}
    />
  );

  const DetailsRow = useMemo(() => {
    function Row(props) {
      const item = {
        ...(props?.item || {}), // eslint-disable-line react/prop-types
        profile: { id: policyId, name: policyName },
      };

      return props?.item?.loaded || skipValueDefinitions ? ( // eslint-disable-line react/prop-types
        <RuleDetailsRow
          onValueChange={onValueOverrideSave}
          onRuleValueReset={onRuleValueReset}
          item={item}
        />
      ) : (
        // TODO This doesn't appear correctly in the tree view
        <Skeleton />
      );
    }

    return Row;
  }, [policyId, policyName, onValueOverrideSave, onRuleValueReset]);

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
        ...(activeFiltersPassed && {
          activeFilters: { ...activeFilters },
        }),
      }}
      options={{
        ...COMPLIANCE_TABLE_DEFAULTS,
        ...options,
        defaultTableView,
        // TODO set this in views where we want a tree and make rows default
        enableTreeView: true,
        tableTree: ruleTree,
        onSelect: (onSelect || remediationsEnabled) && setSelectedRules,
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
  rules: propTypes.array,
  ruleTree: propTypes.array,
  policyId: propTypes.string,
  policyName: propTypes.string,
  hidePassed: propTypes.bool,
  activeFiltersPassed: propTypes.bool,
  remediationsEnabled: propTypes.bool,
  ansibleSupportFilter: propTypes.bool,
  selectedRules: propTypes.array,
  selectedFilter: propTypes.bool,
  columns: propTypes.array,
  options: propTypes.object,
  activeFilters: propTypes.object,
  ruleValues: propTypes.object,
  onRuleValueReset: propTypes.func,
  DedicatedAction: propTypes.node,
  valueDefinitions: propTypes.shape({
    data: propTypes.any,
    loading: propTypes.bool.isRequired,
  }),
  skipValueDefinitions: propTypes.bool,
  onValueOverrideSave: propTypes.func,
  onSelect: propTypes.oneOf([propTypes.func, propTypes.bool]),
  total: propTypes.number,
  defaultTableView: propTypes.string,
  reportTestResult: propTypes.object,
  valueOverrides: propTypes.object,
};

export default RulesTable;
