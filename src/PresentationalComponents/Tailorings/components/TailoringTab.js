import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { Grid } from '@patternfly/react-core';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import { useFullTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import { RulesTable } from 'PresentationalComponents';
import useTailoringsData from '../hooks/useTailoringsData';
import useSecurityGuideData from '../hooks/useSecurityGuideData';
import useSecurityGuideProfileData from '../hooks/useSecurityGuideProfileData';
import { prepareTreeTable, prepareRules, skips } from '../helpers';
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
 *  @param   {object}             [props.selected]                       An array of currently selected IDs
 *  @param   {object}             [props.preselected]                    An array of rule IDs to select
 *  @param   {string}             [props.skipProfile]
 *  @param                        [props.additionalRules]
 *  @param                        [props.valueOverrides]
 *  @param                        [props.showResetButton]                Enables reset rules button
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
  columns,
  systemCount,
  rulesTableProps,
  resetLink,
  rulesPageLink,
  setRuleValues,
  onRuleValueReset,
  onValueOverrideSave,
  onSelect,
  selected,
  preselected,
  additionalRules,
  enableSecurityGuideRulesToggle,
  skipProfile,
  valueOverrides,
  showResetButton = false,
}) => {
  const tableState = useFullTableState();
  const openRuleGroups = tableState?.tableState?.['open-items'];
  const groupFilter = useMemo(() => {
    return tableState?.tableState?.tableView === 'tree' &&
      openRuleGroups?.length > 0
      ? `rule_group_id ^ (${openRuleGroups.map((id) => `${id}`).join(' ')})`
      : undefined;
  }, [tableState, openRuleGroups]);

  const securityGuideId = securityGuideIdProp || tailoring?.security_guide_id;
  const shouldSkip = skips({
    skipProfile,
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
    fetchAllIds: fetchAllSecurityGuideRuleIds,
    exporter: securityGuideRulesExporter,
  } = useSecurityGuideData({
    securityGuideId,
    profileId,
    ...shouldSkip.securityGuide,
    ...(groupFilter ? { groupFilter } : {}),
    tableState,
  });

  const {
    data: { rules: profileRules, ruleTree: profileRuleTree },
  } = useSecurityGuideProfileData({
    securityGuideId,
    profileId,
    groupFilter,
    tableState,
    ...shouldSkip.profile,
  });

  const {
    data: { ruleTree: tailoringRuleTree, rules: tailoringRules },
    fetchAllIds: fetchAllTailoringRuleIds,
    exporter: tailoringRulesExporter,
  } = useTailoringsData({
    policy,
    tailoring,
    tableState,
    ...shouldSkip.tailoring,
    ...(groupFilter ? { groupFilter } : {}),
  });

  const rules = useMemo(
    () =>
      prepareRules({
        shouldSkip,
        securityGuideRules,
        profileRules,
        tailoringRules,
        valueDefinitions,
        valueOverrides: { ...tailoring?.value_overrides, ...valueOverrides },
        ...(tableState?.tableState?.selectedRulesOnly ? { selected } : {}),
      }),
    [
      shouldSkip,
      tailoring,
      tailoringRules,
      securityGuideRules,
      profileRules,
      valueDefinitions,
      valueOverrides,
      selected,
      tableState,
    ]
  );

  const ruleTree = useMemo(
    () =>
      prepareTreeTable({
        shouldSkip,
        securityGuideRuleTree,
        profileRuleTree,
        tailoringRuleTree,
        additionalRules,
        ruleGroups,
      }),
    [
      shouldSkip,
      tailoringRuleTree,
      additionalRules,
      ruleGroups,
      securityGuideRuleTree,
      profileRuleTree,
    ]
  );

  // TODO we might want to consider making this more explicit and also add SSG profile exporter and ids call
  const exporter = async () =>
    tailoring && policy
      ? await tailoringRulesExporter()
      : await securityGuideRulesExporter();

  const itemIdsInTable = async () =>
    tailoring && policy
      ? await fetchAllTailoringRuleIds()
      : await fetchAllSecurityGuideRuleIds();

  const onValueSave = (_policyId, ...valueParams) =>
    onValueOverrideSave(tailoring || osMinorVersion, ...valueParams);

  const onSelectRule = (...ruleParams) =>
    onSelect?.(
      tailoring || { ...securityGuide?.data, os_minor_version: osMinorVersion },
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
            showResetButton={showResetButton}
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
        onRuleValueReset={onRuleValueReset}
        onValueOverrideSave={onValueSave}
        onSelect={onSelect ? onSelectRule : undefined}
        selectedRules={selected}
        preselected={preselected}
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
  valueOverrides: propTypes.object,
  columns: propTypes.array,
  onSelect: propTypes.func,
  systemCount: propTypes.number,
  rulesTableProps: propTypes.object,
  resetLink: propTypes.bool,
  rulesPageLink: propTypes.bool,
  setRuleValues: propTypes.func,
  onRuleValueReset: propTypes.func,
  onValueOverrideSave: propTypes.func,
  showResetButton: propTypes.bool,
  selected: propTypes.array,
  preselected: propTypes.array,
  enableSecurityGuideRulesToggle: propTypes.bool,
  skipProfile: propTypes.string,
  additionalRules: propTypes.object,
};

const TailoringTabProvider = (props) => (
  <TableStateProvider>
    <TailoringTab {...props} />
  </TableStateProvider>
);

export default TailoringTabProvider;
