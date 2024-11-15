import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { Grid } from '@patternfly/react-core';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import { useFullTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import RulesTable from '../../RulesTable/RulesTableRest';
import useTailoringsData from '../hooks/useTailoringsData';
import useSecurityGuideData from '../hooks/useSecurityGuideData';
import useRulesExporter from '../hooks/useRulesExporter';
import { buildTreeTable, skips } from '../helpers';
import TabHeader from './TabHeader';
import useFetchAllTailoringRuleIds from './useFetchAllTailoringRuleIds';
import useFetchAllSecurityGuideRuleIds from './useFetchAllSecurityGuideRuleIds';

// TODO Pass on and enable ruleTree here when RHINENG-13519 is done
const TailoringTab = ({
  policy,
  tailoring,
  osMinorVersion,
  securityGuide,
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
}) => {
  const tableState = useFullTableState();
  const openRuleGroups = tableState?.tableState?.['open-items'];
  const groupFilter =
    tableState?.tableState?.tableView === 'tree' && openRuleGroups?.length > 0
      ? `rule_group_id ^ (${openRuleGroups.map((id) => `${id}`).join(' ')})`
      : undefined;
  const securityGuideId = securityGuide?.id || tailoring?.security_guide_id;
  const shouldSkip = useMemo(
    () => skips(policy, tailoring, securityGuide, tableState),
    [policy, tailoring, securityGuide, tableState]
  );
  const {
    data: {
      ruleGroups,
      ruleTree: securityGuideRuleTree,
      rules: securityGuideRules,
      valueDefinitions,
    },
    fetchRules: fetchSecurityGuideRules,
  } = useSecurityGuideData(securityGuideId, {
    skipRules: shouldSkip.securityGuide.rules,
    skipRuleTree: shouldSkip.securityGuide.ruleTree,
    ...(groupFilter ? { groupFilter } : {}),
    tableState,
  });

  const {
    data: { ruleTree: tailoringRuleTree, rules: tailoringRules },
    fetchRules: fetchTailoringRules,
  } = useTailoringsData({
    policy,
    tailoring,
    tableState,
    skipRules: shouldSkip.tailoring.rules,
    skipRuleTree: shouldSkip.tailoring.ruleTree,
    ...(groupFilter ? { groupFilter } : {}),
  });

  const fetchAllSecurityGuideRuleIds = useFetchAllSecurityGuideRuleIds({
    securityGuideId,
  });

  const fetchAllTailoringRuleIds = useFetchAllTailoringRuleIds({
    policyId: policy?.id,
    tailoringId: tailoring?.id,
  });

  const rules = tailoringRules || securityGuideRules;
  const ruleTree =
    ruleGroups && (tailoringRuleTree || securityGuideRuleTree)
      ? buildTreeTable(tailoringRuleTree || securityGuideRuleTree, ruleGroups)
      : undefined;

  const rulesExporter = useRulesExporter(
    fetchTailoringRules || fetchSecurityGuideRules
  );

  const onValueSave = (_policyId, ...valueParams) =>
    onValueOverrideSave(tailoring || osMinorVersion, ...valueParams);

  const onSelectRule = (...ruleParams) =>
    onSelect?.(tailoring || osMinorVersion, ...ruleParams);

  return (
    <>
      <Grid>
        <TabHeader
          tailoring={tailoring || securityGuide}
          rulesPageLink={rulesPageLink}
          resetLink={resetLink}
          systemCount={systemCount}
        />
      </Grid>
      <RulesTable
        policyId={policy?.id}
        securityGuideId={tailoring?.security_guide_id || securityGuideId}
        total={rules?.meta?.total}
        ruleTree={ruleTree}
        rules={rules?.data}
        ansibleSupportFilter
        remediationsEnabled={false}
        columns={columns}
        setRuleValues={setRuleValues}
        ruleValues={tailoring?.value_overrides || {}}
        valueDefinitions={valueDefinitions}
        onRuleValueReset={onRuleValueReset}
        onValueOverrideSave={onValueSave}
        onSelect={onSelect ? onSelectRule : undefined}
        selectedRules={preselected}
        options={{
          exporter: rulesExporter,
          itemIdsInTable: securityGuide?.id
            ? fetchAllSecurityGuideRuleIds
            : fetchAllTailoringRuleIds,
        }}
        {...rulesTableProps}
      />
    </>
  );
};

TailoringTab.propTypes = {
  policy: propTypes.object,
  tailoring: propTypes.object,
  securityGuide: propTypes.object,
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
};

const TailoringTabProvider = (props) => (
  <TableStateProvider>
    <TailoringTab {...props} />
  </TableStateProvider>
);

export default TailoringTabProvider;
