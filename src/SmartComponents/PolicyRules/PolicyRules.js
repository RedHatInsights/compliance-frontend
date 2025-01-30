import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import RulesTableRest from 'PresentationalComponents/RulesTable/RulesTable';
import PolicyRulesHeader from './PolicyRulesHeader';
import { usePolicyRulesList } from '@/Utilities/hooks/api/usePolicyRulesList';
import { useFullTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import { policyRulesSkips } from './helpers';
import useSecurityGuide from 'Utilities/hooks/api/useSecurityGuide';
import useProfile from 'Utilities/hooks/api/useProfile';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';

const PolicyRules = () => {
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
  const osMajorVersion = securityGuideData?.data?.os_major_version;
  const benchmarkVersion = securityGuideData?.data?.version;

  const { data: profileData } = useProfile({
    params: {
      securityGuideId: securityGuideId,
      profileId: profileId,
    },
  });
  const headerName = profileData?.data?.title;

  const { data, loading /*fetchRules*/ } = usePolicyRulesList({
    profileId,
    securityGuideId,
    tableState,
    ...(groupFilter ? { groupFilter } : {}),
    shouldSkip,
  });

  const { rules, builtTree } = data;

  //TODO: Disabled for now. Bring back during polishing.
  // const rulesExporter = useRulesExporter(fetchRules);

  return (
    <>
      <PolicyRulesHeader
        name={headerName}
        benchmarkVersion={benchmarkVersion}
        osMajorVersion={osMajorVersion}
      />
      <div className="pf-v5-u-p-xl" style={{ background: '#fff' }}>
        <RulesTableRest
          policyId={profileId}
          securityGuideId={securityGuideId}
          total={rules?.meta.total}
          rules={rules?.data}
          remediationsEnabled={false}
          columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
          ruleValues={{}}
          loading={loading}
          ruleTree={builtTree}
        />
      </div>
    </>
  );
};

const PolicyRulesProvider = () => (
  <TableStateProvider>
    <PolicyRules/>
  </TableStateProvider>
);

export default PolicyRulesProvider;
