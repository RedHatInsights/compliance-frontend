import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import { RulesTable } from '@/PresentationalComponents';
import PolicyRulesHeader from './PolicyRulesHeader';
import { usePolicyRulesList } from '@/Utilities/hooks/api/usePolicyRulesList';
import { useFullTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import { policyRulesSkips } from './helpers';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import useSecurityGuide from 'Utilities/hooks/api/useSecurityGuide';
import useProfile from 'Utilities/hooks/api/useProfile';

const PolicyDefaultRules = () => {
  const tableState = useFullTableState();
  const { policy_id: profileId, security_guide_id: securityGuideId } =
    useParams();

  const openRuleGroups = tableState?.tableState?.['open-items'];
  const groupFilter =
    tableState?.tableState?.tableView === 'tree' && openRuleGroups?.length > 0
      ? `rule_group_id ^ (${openRuleGroups.map((id) => `${id}`).join(' ')})`
      : undefined;

  const shouldSkip = useMemo(
    () =>
      policyRulesSkips({
        tableState,
        profileId,
        securityGuideId,
      }),
    [tableState]
  );

  const { data: securityGuideData } = useSecurityGuide({
    params: {
      securityGuideId: securityGuideId,
    },
  });

  const { data: profileData } = useProfile({
    params: {
      securityGuideId: securityGuideId,
      profileId: profileId,
    },
  });

  const { data, loading, exporter } = usePolicyRulesList({
    profileId,
    securityGuideId,
    tableState,
    ...(groupFilter ? { groupFilter } : {}),
    shouldSkip,
  });

  const { rules, builtTree } = data;

  return (
    <>
      <PolicyRulesHeader
        name={profileData?.data?.title}
        benchmarkVersion={securityGuideData?.data?.version}
        osMajorVersion={securityGuideData?.data?.os_major_version}
      />
      <div className="pf-v5-u-p-xl" style={{ background: '#fff' }}>
        <RulesTable
          policyId={profileId}
          securityGuideId={securityGuideId}
          total={rules?.meta.total}
          rules={rules?.data}
          remediationsEnabled={false}
          columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
          ruleValues={{}}
          loading={loading}
          ruleTree={builtTree}
          skipValueDefinitions={true}
          options={{
            exporter,
          }}
        />
      </div>
    </>
  );
};

const PolicyRulesWrapper = () => (
  <TableStateProvider>
    <PolicyDefaultRules />
  </TableStateProvider>
);

export default PolicyRulesWrapper;
