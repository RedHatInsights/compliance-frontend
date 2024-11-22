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

const policyTitle =
  'CNSSI 1253 Low/Low/Low Control Baseline for Red Hat Enterprise Linux 7';
const profileId = '0a036ede-252e-4e73-bdd8-9203f93deefe';
const securityGuideId = '3e01872b-e90d-46bb-9b39-012adc00d9b9';
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

const PolicyRulesRest = () => {
  const tableState = useFullTableState();
  // const { policy_id: policyId, security_guide_id: securityGuideId } = useParams();
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
      osMajorVersion={'passedIn paramMajor'}
      benchmarkVersion={'passed in ParamTitle'}
      headerName={policyTitle}
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
