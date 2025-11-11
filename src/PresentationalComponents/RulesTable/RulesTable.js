import React, { useState, useMemo } from 'react';
import propTypes from 'prop-types';
import { Skeleton } from '@patternfly/react-core';
import useComplianceTableDefaults from 'Utilities/hooks/useComplianceTableDefaults';

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
 *  @param   {object}             [props.reportTestResult]     A report test result used for the remediatons button
 *  @param   {boolean}            [props.remediationsEnabled]  Enables the "RemediationButton"
 *  @param   {boolean}            [props.ansibleSupportFilter] Enables the ansible filter
 *  @param   {Array}              [props.selectedRules]        An array of rule IDs selected
 *  @param   {boolean}            [props.hidePassed]           Enables a default filter to only show failed rules.
 *  @param   {object}             [props.options ]             TableToolsTable options
 *  @param   {string}             [props.activeFilters]        Default filter
 *  @param   {boolean}            [props.skipValueDefinitions] TODO
 *  @param   {Function}           [props.onRuleValueReset]     A function called when a rule value is reset
 *  @param   {React.ReactElement} [props.DedicatedAction]      A dedicated action to show in the table
 *  @param   {Function}           [props.onValueOverrideSave]  A funciton called when a value is saved
 *  @param   {Function}           [props.onSelect]             A function called when a selection action is performed
 *  @param   {string}             [props.defaultTableView]     A table view to show by default ("row" or "tree") // TODO we should use the table options directly
 *
 *  @param                        props.loading
 *  @returns {React.ReactElement}
 *
 *  @category Compliance
 *
 */
const RulesTable = ({
  loading,
  rules,
  ruleTree,
  policyId,
  columns = defaultColumns,
  remediationsEnabled,
  ansibleSupportFilter = false,
  selectedRules: selectedRulesProp = [],
  hidePassed = false,
  options,
  activeFilters,
  skipValueDefinitions,
  onRuleValueReset,
  DedicatedAction,
  onValueOverrideSave,
  total,
  onSelect,
  defaultTableView = 'tree',
  reportTestResult,
  ...rulesTableProps
}) => {
  const complianceTableDefaults = useComplianceTableDefaults();
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
      reportTestResults={selectedRules?.length ? [reportTestResult] : []}
      selectedRuleResultIds={selectedRules}
      reportId={policyId}
    />
  );

  const DetailsRow = useMemo(() => {
    function Row(props) {
      const item = {
        ...(props?.item || {}), // eslint-disable-line react/prop-types
        policyId,
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
  }, [
    policyId,
    onValueOverrideSave,
    onRuleValueReset,
    skipValueDefinitions,
  ]);

  return (
    <ComplianceTable
      aria-label="Rules Table"
      loading={loading}
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
        ...(!!activeFilters
          ? {
              activeFilters,
            }
          : {}),
      }}
      options={{
        ...complianceTableDefaults,
        ...options,
        ...(ruleTree
          ? {
              defaultTableView,
              tableTree: ruleTree,
              enableTreeView: true,
            }
          : {}),
        onSelect: (onSelect || remediationsEnabled) && setSelectedRules,
        selected: selectedRules,
        detailsComponent: DetailsRow,
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
  loading: propTypes.bool,
  rules: propTypes.array,
  ruleTree: propTypes.array,
  policyId: propTypes.string,
  hidePassed: propTypes.bool,
  remediationsEnabled: propTypes.bool,
  ansibleSupportFilter: propTypes.bool,
  selectedRules: propTypes.array,
  columns: propTypes.array,
  options: propTypes.object,
  activeFilters: propTypes.object,
  onRuleValueReset: propTypes.func,
  DedicatedAction: propTypes.node,
  skipValueDefinitions: propTypes.bool,
  onValueOverrideSave: propTypes.func,
  onSelect: propTypes.oneOf([propTypes.func, propTypes.bool]),
  total: propTypes.number,
  defaultTableView: propTypes.string,
  reportTestResult: propTypes.object,
};

export default RulesTable;
