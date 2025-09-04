import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import { RulesTable } from '@/PresentationalComponents';
import PolicyRulesHeader from './PolicyRulesHeader';
import { useFullTableState } from 'bastilian-tabletools';
import { TableStateProvider } from 'bastilian-tabletools';
import useSecurityGuide from 'Utilities/hooks/api/useSecurityGuide';
import useProfile from 'Utilities/hooks/api/useProfile';
import useSecurityGuideProfileData from 'PresentationalComponents/Tailorings/hooks/useSecurityGuideProfileData';
import {
  prepareTreeTable,
  skips,
} from 'PresentationalComponents/Tailorings/helpers';
import useSecurityGuideData from 'PresentationalComponents/Tailorings/hooks/useSecurityGuideData';

const PolicyDefaultRules = () => {
  const tableState = useFullTableState();
  const { policy_id: profileId, security_guide_id: securityGuideId } =
    useParams();

  const openRuleGroups = tableState?.tableState?.['open-items'];
  const groupFilter =
    tableState?.tableState?.tableView === 'tree' && openRuleGroups?.length > 0
      ? `rule_group_id ^ (${openRuleGroups.map((id) => `${id}`).join(' ')})`
      : undefined;

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

  const shouldSkip = skips({
    skipProfile: 'policy-default-rules',
    securityGuideId,
    profileId,
    tableState,
  });

  const {
    data: { ruleGroups },
  } = useSecurityGuideData({
    securityGuideId,
    ...shouldSkip.securityGuide,
  });

  const {
    data: { rules: profileRules, ruleTree: profileRuleTree },
    exporter,
  } = useSecurityGuideProfileData({
    securityGuideId,
    profileId,
    groupFilter,
    tableState,
    ...shouldSkip.profile,
  });

  const ruleTree = useMemo(
    () =>
      prepareTreeTable({
        profileRuleTree,
        ruleGroups,
      }),
    [ruleGroups, profileRuleTree],
  );

  return (
    <>
      <PolicyRulesHeader
        name={profileData?.data?.title}
        benchmarkVersion={securityGuideData?.data?.version}
        osMajorVersion={securityGuideData?.data?.os_major_version}
      />
      <div className="pf-v6-u-p-xl" style={{ background: '#fff' }}>
        <RulesTable
          policyId={profileId}
          securityGuideId={securityGuideId}
          total={profileRules?.meta.total}
          ruleTree={ruleTree}
          rules={ruleTree ? profileRules?.data || [] : profileRules?.data}
          ansibleSupportFilter
          remediationsEnabled={false}
          columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
          ruleValues={{}}
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
