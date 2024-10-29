import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import propTypes from 'prop-types';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import RulesTable from '../../PresentationalComponents/RulesTable/RulesTable';
import RulesTableRest from '../../PresentationalComponents/RulesTable/RulesTableRest';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { usePolicyRulesList } from './usePolicyRulesList';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';
import PolicyRulesHeader from './PolicyRulesHeader';
import { useProfileTree } from './useProfileTree';
import TableStateProvider from '../../Frameworks/AsyncTableTools/components/TableStateProvider';
import { buildTreeTable } from '../../PresentationalComponents/Tailorings/helpers';
import useFetchTotalBatched from '../../Utilities/hooks/useFetchTotalBatched';
import useRuleGroups from '../../Utilities/hooks/api/useRuleGroups';

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

const PolicyRulesGraphQL = ({ v2 }) => {
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
      data={data}
      v2={v2}
      loading={loading}
      name={data?.profile?.name}
      benchmarkVersion={data?.profile?.benchmark?.version}
      osMajorVersion={data?.profile?.osMajorVersion}
      profile={data?.profile}
      rules={data?.profile?.rules}
    />
  );
};

PolicyRulesGraphQL.propTypes = {
  v2: propTypes.bool,
};

const PolicyRulesRest = ({ v2 }) => {
  // Example hardcoded data (replace with actual data)
  const policyTitle =
    'CNSSI 1253 Low/Low/Low Control Baseline for Red Hat Enterprise Linux 7';
  const profileId2 = '0a036ede-252e-4e73-bdd8-9203f93deefe';
  const securityGuidesId = '3e01872b-e90d-46bb-9b39-012adc00d9b9';
  const [isPageLoading, setIsPageLoading] = useState(false); // Separate loading state for pagination
  const [allData, setAllData] = useState([]); // Store accumulated data
  const [offset, setOffset] = useState(0);
  const limit = 100;

  const { data, loading } = usePolicyRulesList({
    securityGuideId: securityGuidesId,
    profileId: profileId2,
    offset,
    limit,
  });
  const { data: ruleTreeData, loading: rulesTreeLoading } = useProfileTree({
    securityGuideId: securityGuidesId,
    profileId: profileId2,
  });

  const { fetch: fetchRuleGroups } = useRuleGroups(securityGuidesId, {
    skip: true,
  });

  const fetchRuleGroupsForBatch = useCallback(
    (offset, limit) =>
      fetchRuleGroups([securityGuidesId, undefined, limit, offset], false),
    [fetchRuleGroups, securityGuidesId]
  );

  const { loading: ruleGroupsLoading, data: ruleGroupsData } =
    useFetchTotalBatched(fetchRuleGroupsForBatch, {
      batchSize: 60,
    });

  // Use effect to handle new data fetching and appending logic
  useEffect(() => {
    if (data && !loading && data?.data.length > 0) {
      setAllData((prevData) => [...prevData, ...data.data]);
      // Check if there is more data to fetch based on meta info
      if (data.meta && data.meta.offset + data.meta.limit < data.meta.total) {
        // Trigger the next page by increasing the offset
        setOffset((prevOffset) => prevOffset + limit);
      }
      setIsPageLoading(false);
    }
  }, [data, loading, setOffset]);

  if (isPageLoading || rulesTreeLoading || ruleGroupsLoading) {
    return (
      <PageHeader>
        <Spinner />
      </PageHeader>
    );
  }
  const builtTree = ruleGroupsData
    ? buildTreeTable(ruleTreeData, ruleGroupsData)
    : undefined;

  return (
    <>
      <PolicyRulesBase
        data={allData}
        loading={loading}
        v2={v2}
        offset={offset}
        setOffset={setOffset}
        limit={limit}
        profile={[{ id: profileId2, name: policyTitle }]}
        ruleTree={builtTree}
        osMajorVersion={'passedIn paramMajor'}
        benchmarkVersion={'passed in ParamTitle'}
        headerName={policyTitle}
        rules={allData}
      />
    </>
  );
};

PolicyRulesRest.propTypes = {
  v2: propTypes.bool,
};

const PolicyRulesBase = ({
  loading,
  v2,
  profile,
  rules,
  osMajorVersion,
  benchmarkVersion,
  headerName,
  ruleTree,
}) => {
  return (
    <React.Fragment>
      <PolicyRulesHeader
        name={headerName}
        benchmarkVersion={benchmarkVersion}
        osMajorVersion={osMajorVersion}
      />

      <div className="pf-v5-u-p-xl" style={{ background: '#fff' }}>
        {v2 ? (
          <TableStateProvider>
            <RulesTableRest
              remediationsEnabled={false}
              columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
              rules={rules}
              ruleValues={{}}
              options={{ pagination: false, manageColumns: false }}
              ruleTree={ruleTree}
            />
          </TableStateProvider>
        ) : (
          <RulesTable
            remediationsEnabled={false}
            columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
            loading={loading}
            profileRules={[
              {
                profile,
                rules,
              },
            ]}
            options={{ pagination: false, manageColumns: false }}
          />
        )}
      </div>
    </React.Fragment>
  );
};

PolicyRulesBase.propTypes = {
  loading: propTypes.bool,
  v2: propTypes.bool,
  profile: propTypes.array,
  rules: propTypes.array,
  osMajorVersion: propTypes.string,
  benchmarkVersion: propTypes.string,
  headerName: propTypes.string,
  ruleTree: propTypes.any,
};

const PolicyRulesWrapper = () => {
  const apiV2Enabled = useAPIV2FeatureFlag();
  if (apiV2Enabled === undefined) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  const PolicyRules = apiV2Enabled ? PolicyRulesRest : PolicyRulesGraphQL;

  return <PolicyRules v2={apiV2Enabled} />;
};

export default PolicyRulesWrapper;
