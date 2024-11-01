import React, { useCallback } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import propTypes from 'prop-types';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import RulesTable from '@/PresentationalComponents/RulesTable/RulesTable';
import RulesTableRest from '@/PresentationalComponents/RulesTable/RulesTableRest';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import { Spinner } from '@patternfly/react-core';
import { usePolicyRulesList } from '@/Utilities/hooks/api/usePolicyRulesList';
import PolicyRulesHeader from './PolicyRulesHeader';
import { useProfileTree } from '@/Utilities/hooks/api/useProfileTree';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import { buildTreeTable } from '@/PresentationalComponents/Tailorings/helpers';
import useFetchTotalBatched from '@/Utilities/hooks/useFetchTotalBatched';
import useRuleGroups from '@/Utilities/hooks/api/useRuleGroups';
import GatedComponents from 'PresentationalComponents/GatedComponents';
import { ErrorPage, StateView, StateViewPart } from 'PresentationalComponents';

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
  const { data, loading, error } = useQuery(PROFILES_QUERY, {
    variables: {
      policyId: policyId,
    },
  });

  return (
    <StateView stateValues={{ error, data, loading }}>
      <StateViewPart stateKey="error">
        <ErrorPage error={error} />
      </StateViewPart>
      <StateViewPart stateKey="loading">
        <PageHeader>
          <Spinner />
        </PageHeader>
      </StateViewPart>
      <StateViewPart stateKey="data">
        <PolicyRulesBase
          name={data?.profile?.name}
          benchmarkVersion={data?.profile?.benchmark?.version}
          osMajorVersion={data?.profile?.osMajorVersion}
          component={
            <RulesTable
              remediationsEnabled={false}
              columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
              loading={loading}
              profileRules={[
                {
                  profile: data?.profile,
                  rules: data?.profile?.rules,
                },
              ]}
              options={{ pagination: false, manageColumns: false }}
            />
          }
        />
      </StateViewPart>
    </StateView>
  );
};

const PolicyRulesRest = () => {
  //TODO: Data is currently hardcoded, once modals are migrated we can pass in IDs in TabHeader
  // const { policy_id: policyId, security_guide_id: securityGuidesId } = useParams();
  const policyTitle =
    'CNSSI 1253 Low/Low/Low Control Baseline for Red Hat Enterprise Linux 7';
  const profileId2 = '0a036ede-252e-4e73-bdd8-9203f93deefe';
  const securityGuidesId = '3e01872b-e90d-46bb-9b39-012adc00d9b9';

  const {
    data: rulesTreeData,
    loading: rulesTreeLoading,
    error: rulesTreeError,
  } = useProfileTree({
    securityGuideId: securityGuidesId,
    profileId: profileId2,
  });

  const { fetch: fetchPolicyRulesList } = usePolicyRulesList({
    params: {
      profileId2,
      securityGuidesId,
    },
  });

  const fetchPolicyRulesListForBatch = useCallback(
    (offset, limit) =>
      fetchPolicyRulesList(
        [securityGuidesId, profileId2, undefined, limit, offset],
        false
      ),
    [fetchPolicyRulesList, securityGuidesId]
  );
  const {
    loading: isPolicyRulesListLoading,
    data: policyRulesListsData,
    error: policyRulesListError,
  } = useFetchTotalBatched(fetchPolicyRulesListForBatch, {
    batchSize: 50,
  });

  const { fetch: fetchRuleGroups } = useRuleGroups({
    params: {
      securityGuidesId,
    },
    skip: true,
  });

  const fetchRuleGroupsForBatch = useCallback(
    (offset, limit) =>
      fetchRuleGroups([securityGuidesId, undefined, limit, offset], false),
    [fetchRuleGroups, securityGuidesId]
  );

  const {
    loading: ruleGroupsLoading,
    data: ruleGroupsData,
    error: ruleGroupsError,
  } = useFetchTotalBatched(fetchRuleGroupsForBatch, {
    batchSize: 60,
  });

  let isLoading =
    isPolicyRulesListLoading ||
    rulesTreeLoading ||
    ruleGroupsLoading ||
    undefined;
  let allErrors =
    policyRulesListError || rulesTreeError || ruleGroupsError || undefined;
  let allData =
    policyRulesListsData && rulesTreeData && ruleGroupsData ? true : undefined;

  const builtTree = ruleGroupsData
    ? buildTreeTable(rulesTreeData, ruleGroupsData)
    : undefined;

  return (
    <StateView stateValues={{ allErrors, allData, isLoading }}>
      <StateViewPart stateKey="allErrors">
        <ErrorPage error={allErrors} />
      </StateViewPart>
      <StateViewPart stateKey={'isLoading'}>
        <PageHeader>
          <Spinner />
        </PageHeader>
      </StateViewPart>
      <StateViewPart stateKey={'allData'}>
        <PolicyRulesBase
          osMajorVersion={'passedIn paramMajor'}
          benchmarkVersion={'passed in ParamTitle'}
          headerName={policyTitle}
          component={
            <TableStateProvider>
              <RulesTableRest
                remediationsEnabled={false}
                columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
                rules={policyRulesListsData}
                ruleValues={{}}
                options={{ pagination: false, manageColumns: false }}
                ruleTree={builtTree}
              />
            </TableStateProvider>
          }
        />
      </StateViewPart>
    </StateView>
  );
};

const PolicyRulesBase = ({
  osMajorVersion,
  benchmarkVersion,
  headerName,
  component,
}) => {
  return (
    <React.Fragment>
      <PolicyRulesHeader
        name={headerName}
        benchmarkVersion={benchmarkVersion}
        osMajorVersion={osMajorVersion}
      />
      <div className="pf-v5-u-p-xl" style={{ background: '#fff' }}>
        {component}
      </div>
    </React.Fragment>
  );
};

PolicyRulesBase.propTypes = {
  osMajorVersion: propTypes.string,
  benchmarkVersion: propTypes.string,
  headerName: propTypes.string,
  component: propTypes.any,
};

const PolicyRulesWrapper = () => (
  <GatedComponents
    RestComponent={PolicyRulesRest}
    GraphQLComponent={PolicyRulesGraphQL}
  />
);

export default PolicyRulesWrapper;
