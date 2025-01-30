import React from 'react';
import propTypes from 'prop-types';
import { Grid } from '@patternfly/react-core';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import { useFullTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import RulesTable from '../../RulesTable/RulesTableRest';
import useTailoringsData from '../hooks/useTailoringsData';
import useSecurityGuideData from '../hooks/useSecurityGuideData';
import { buildTreeTable, skips } from '../helpers';
import TabHeader from './TabHeader';
import SecurityGuideRulesToggle from './SecurityGuideRulesToggle';

/**
 * This component is used to show either the tailorings with rules of a specific policy,
 * or the rules of a specific security guide and it's rules for a set of minor OS versions
 *
 *  @param   {object}             [props]                                React component props
 *  @param   {object}             [props.policy]                         A policy object from the API
 *  @param   {string}             [props.policy.id]                      The id used to fetch
 *  @param   {object}             [props.tailoring]                      A tailoring object from the API
 *  @param   {string}             [props.tailoring.id]                   A tailorings ID used to fetch the associated rules, rule groups, and value definitions for
 *  @param   {string}             [props.securityGuideId]                The ID for a security guide that the profile should be queried with
 *  @param   {string}             [props.profileId]                      The ID for a specific profile the rules should fetched for
 *  @param   {string}             [props.osMajorVersion]                 A specific major OS version the profile should be queried with
 *  @param   {string}             [props.osMinorVersion]                 A specific minor OS versions that the profile should be for
 *  @param   {object}             [ props.ruleValues]                    An object to provide custom values for rules
 *  @param   {Array}              [props.columns]                        A set of RulesTable columns the table should show
 *  @param   {boolean}            [props.enableSecurityGuideRulesToggle] This enabled the "Selected Only" toggle to appear and allows fetching the security guide rule set for the matching profile
 *  @param                        [props.systemCount]
 *  @param                        [props.rulesPageLink]
 *  @param   {object}             props.rulesTableProps                  React component props to be passed on to the RulesTable component in the tab
 *  @param                        props.resetLink
 *  @param   {Function}           [props.setRuleValues]                  A callback called when a custom rule value is saved
 *  @param   {Function}           [props.onRuleValueReset]               A callback called when values for a rule are reset
 *  @param   {Function}           [props.onValueOverrideSave]            **deprecated** We should be using setRuleValues instead
 *  @param   {Function}           [props.onSelect]                       A callback called when a selection is made
 *  @param   {object}             [props.preselected]                    An array of rule IDs to select
 *
 *  @returns {React.ReactElement}
 *
 *  @category Compliance
 *  @tutorial how-to-use-tailorings
 *
 */
const TailoringTab = ({
  policy,
  tailoring,
  securityGuideId: securityGuideIdProp,
  osMajorVersion,
  osMinorVersion,
  profileId,
  ruleValues,
  columns,
  systemCount,
  rulesTableProps,
  resetLink,
  rulesPageLink,
  setRuleValues,
  onRuleValueReset,
  onValueOverrideSave,
  onSelect,
  preselected,
  enableSecurityGuideRulesToggle,
}) => {
  const tableState = useFullTableState();
  const openRuleGroups = tableState?.tableState?.['open-items'];
  const groupFilter =
    tableState?.tableState?.tableView === 'tree' && openRuleGroups?.length > 0
      ? `rule_group_id ^ (${openRuleGroups.map((id) => `${id}`).join(' ')})`
      : undefined;
  const securityGuideId = securityGuideIdProp || tailoring?.security_guide_id;
  const shouldSkip = skips({
    policy,
    tailoring,
    securityGuideId,
    profileId,
    tableState,
  });

  const {
    data: {
      securityGuide,
      ruleGroups,
      ruleTree: securityGuideRuleTree,
      rules: securityGuideRules,
      valueDefinitions,
    },
    fetchBatchedRules,
  } = useSecurityGuideData({
    securityGuideId,
    profileId,
    skipRules: shouldSkip.securityGuide.rules,
    skipRuleTree: shouldSkip.securityGuide.ruleTree,
    skipRuleGroups: shouldSkip.securityGuide.ruleGroups,
    skipValueDefinitions: shouldSkip.securityGuide.valueDefinitions,
    skipProfileRules: shouldSkip.securityGuide.profile.rules,
    skipProfileTree: shouldSkip.securityGuide.profile.ruleTree,
    ...(groupFilter ? { groupFilter } : {}),
    tableState,
  });

  const {
    data: { ruleTree: tailoringRuleTree, rules: tailoringRules },
    fetchBatchedTailoringRules,
  } = useTailoringsData({
    policy,
    tailoring,
    tableState,
    skipRules: shouldSkip.tailoring.rules,
    skipRuleTree: shouldSkip.tailoring.ruleTree,
    ...(groupFilter ? { groupFilter } : {}),
  });
  const rules = tailoringRules || securityGuideRules;
  const ruleTree =
    ruleGroups && (tailoringRuleTree || securityGuideRuleTree)
      ? buildTreeTable(
          tailoringRuleTree || securityGuideRuleTree,
          ruleGroups?.data,
          preselected
        )
      : undefined;

  // TODO The wrapping of the fetches in an array is odd.
  // Figure out why this is and how we can avoid it
  const exporter = async () =>
    (tailoring && policy
      ? [await fetchBatchedTailoringRules()]
      : [await fetchBatchedRules()]
    ).flatMap((result) => result.data);

  const itemIdsInTable = async () =>
    (tailoring && policy
      ? await fetchBatchedTailoringRules({ idsOnly: true })
      : await fetchBatchedRules({ idsOnly: true })
    )
      .flatMap((result) => result.data)
      .map(({ id }) => id);

  const onValueSave = (_policyId, ...valueParams) =>
    onValueOverrideSave(tailoring || osMinorVersion, ...valueParams);

  const onSelectRule = (...ruleParams) =>
    onSelect?.(
      tailoring || { ...securityGuide.data, os_minor_version: osMinorVersion },
      ...ruleParams
    );

  return (
    <>
      <Grid>
        {(tailoring || securityGuide) && (
          <TabHeader
            tailoring={tailoring}
            securityGuide={
              securityGuide && {
                ...securityGuide.data,
                osMajorVersion,
                osMinorVersion,
              }
            }
            profileId={profileId || tailoring.profile_id}
            rulesPageLink={rulesPageLink}
            resetLink={resetLink}
            systemCount={systemCount}
          />
        )}
      </Grid>
      <RulesTable
        policyId={policy?.id}
        securityGuideId={tailoring?.security_guide_id || securityGuideId}
        total={rules?.meta?.total}
        ruleTree={ruleTree}
        rules={ruleTree ? rules?.data || [] : rules?.data}
        ansibleSupportFilter
        remediationsEnabled={false}
        columns={columns}
        setRuleValues={setRuleValues}
        // TODO Doublecheck if we should set default profile value_override values when creating a policy
        // TODO in order to be clean this needs to change and we need to merge overrides passed in with the ones from tailoring
        ruleValues={tailoring?.value_overrides || {}}
        valueDefinitions={{
          data: valueDefinitions?.data,
          loading:
            shouldSkip.securityGuide.valueDefinitions === false &&
            valueDefinitions === undefined,
        }}
        // TODO follow up on above, this and everything related within the details row can go
        valueOverrides={ruleValues}
        onRuleValueReset={onRuleValueReset}
        onValueOverrideSave={onValueSave}
        onSelect={onSelect ? onSelectRule : undefined}
        selectedRules={preselected}
        options={{
          exporter,
          itemIdsInTable,
        }}
        {...rulesTableProps}
        {...(enableSecurityGuideRulesToggle
          ? {
              DedicatedAction: SecurityGuideRulesToggle,
            }
          : {})}
      />
    </>
  );
};

TailoringTab.propTypes = {
  policy: propTypes.shape({
    id: propTypes.string,
  }),
  tailoring: propTypes.shape({
    id: propTypes.string,
    profile_id: propTypes.string,
    security_guide_id: propTypes.string,
    value_overrides: propTypes.array,
  }),
  securityGuideId: propTypes.string,
  profileId: propTypes.string,
  osMajorVersion: propTypes.string,
  osMinorVersion: propTypes.string,
  ruleValues: propTypes.object,
  columns: propTypes.array,
  onSelect: propTypes.func,
  systemCount: propTypes.number,
  rulesTableProps: propTypes.object,
  resetLink: propTypes.bool,
  rulesPageLink: propTypes.bool,
  setRuleValues: propTypes.func,
  onRuleValueReset: propTypes.func,
  onValueOverrideSave: propTypes.func,
  preselected: propTypes.object,
  enableSecurityGuideRulesToggle: propTypes.bool,
};

const TailoringTabProvider = (props) => (
  <TableStateProvider>
    <TailoringTab {...props} />
  </TableStateProvider>
);

export default TailoringTabProvider;
