import React, { useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import propTypes from 'prop-types';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import RulesTable from '@/PresentationalComponents/RulesTable/RulesTable';
import RulesTableRest from '@/PresentationalComponents/RulesTable/RulesTableRest';
import PolicyRulesHeader from './PolicyRulesHeader';
import GatedComponents from 'PresentationalComponents/GatedComponents';
import { usePolicyRulesList } from '@/Utilities/hooks/api/usePolicyRulesList';
import { useFullTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import { policyRulesSkips } from './helpers';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { Spinner } from '@patternfly/react-core';
import useSecurityGuide from 'Utilities/hooks/api/useSecurityGuide';
import useProfile from 'Utilities/hooks/api/useProfile';

const PROFILES_QUERY = gql`
  query PR_Profile($policyId: String!) {
    profile(id: $policyId) {
      id
      name
      refId
      osMinorVersion
      osMajorVersion
      benchmark {
        version
        ruleTree
      }
      rules {
        id
        title
        severity
        rationale
        refId
        description
        remediationAvailable
        identifier
      }
    }
  }
`;

const PolicyRulesGraphQL = () => {
  const { policy_id: policyId } = useParams();
  const { data, loading } = useQuery(PROFILES_QUERY, {
    variables: {
      policyId: policyId,
    },
  });

  return loading ? (
    <PageHeader>
      <Spinner />
    </PageHeader>
  ) : (
    <PolicyRulesBase
      name={data?.profile?.name}
      benchmarkVersion={data?.profile?.benchmark?.version}
      osMajorVersion={data?.profile?.osMajorVersion}
    >
      <RulesTable
        remediationsEnabled={false}
        columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
        loading={loading}
        profileRules={[{ profile: data?.profile, rules: data?.profile?.rules }]}
        options={{ pagination: false, manageColumns: false }}
      />
    </PolicyRulesBase>
  );
};

//TODO: Data is currently hardcoded, once modals are migrated we can pass in IDs in TabHeader
const PolicyRulesRest = () => {
  const tableState = useFullTableState();
  const { policy_id: profileId, security_guide_id: securityGuideId } = useParams();
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
  })

  const { data: profileData } = useProfile({
    params: {
      securityGuideId: securityGuideId,
      profileId: profileId,
    },
  })

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
    <PolicyRulesBase
      osMajorVersion={securityGuideData?.data?.os_major_version}
      benchmarkVersion={securityGuideData?.data?.version}
      headerName={profileData?.data?.title}
    >
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
    </PolicyRulesBase>
  );
};

const PolicyRulesBase = ({
  osMajorVersion,
  benchmarkVersion,
  headerName,
  children,
}) => {
  return (
    <>
      <PolicyRulesHeader
        name={headerName}
        benchmarkVersion={benchmarkVersion}
        osMajorVersion={osMajorVersion}
      />
      <div className="pf-v5-u-p-xl" style={{ background: '#fff' }}>
        {children}
      </div>
    </>
  );
};

PolicyRulesBase.propTypes = {
  osMajorVersion: propTypes.string,
  benchmarkVersion: propTypes.string,
  headerName: propTypes.string,
  children: propTypes.any,
};

const PolicyRulesWrapper = () => (
  <TableStateProvider>
    <GatedComponents
      RestComponent={PolicyRulesRest}
      GraphQLComponent={PolicyRulesGraphQL}
    />
  </TableStateProvider>
);

export default PolicyRulesWrapper;
