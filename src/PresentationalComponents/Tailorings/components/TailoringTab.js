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
      ? buildTreeTable(tailoringRuleTree || securityGuideRuleTree, ruleGroups)
      : undefined;

  const exporter = async () =>
    (tailoring && policy
      ? await fetchBatchedTailoringRules()
      : await fetchBatchedRules()
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
    onSelect?.(tailoring || osMinorVersion, ...ruleParams);

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
            profileId={profileId}
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
        ruleValues={tailoring?.value_overrides || {}}
        valueDefinitions={valueDefinitions?.data}
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
  policy: propTypes.object,
  tailoring: propTypes.object,
  securityGuideId: propTypes.string,
  profileId: propTypes.string,
  osMajorVersion: propTypes.string,
  osMinorVersion: propTypes.string,
  columns: propTypes.array,
  handleSelect: propTypes.func,
  systemCount: propTypes.number,
  selectedRuleRefIds: propTypes.array,
  rulesTableProps: propTypes.object,
  resetLink: propTypes.bool,
  rulesPageLink: propTypes.bool,
  setRuleValues: propTypes.func,
  ruleValues: propTypes.array,
  onRuleValueReset: propTypes.func,
  onValueOverrideSave: propTypes.func,
  onSelect: propTypes.func,
  preselected: propTypes.object,
  enableSecurityGuideRulesToggle: propTypes.bool,
};

const TailoringTabProvider = (props) => (
  <TableStateProvider>
    <TailoringTab {...props} />
  </TableStateProvider>
);

export default TailoringTabProvider;
