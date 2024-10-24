import React, { useEffect, useState } from 'react';
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
  const query = useQuery(PROFILES_QUERY, {
    variables: {
      policyId: policyId,
    },
  });
  return <PolicyRulesBase query={query} v2={v2} />;
};

PolicyRulesGraphQL.propTypes = {
  v2: propTypes.bool,
};

const PolicyRulesRest = ({ v2 }) => {
  const profileId2 = '0a036ede-252e-4e73-bdd8-9203f93deefe';
  const securityGuidesId = '3e01872b-e90d-46bb-9b39-012adc00d9b9';
  const [offset, setOffset] = useState(0);
  const limit = 100;

  const query = usePolicyRulesList({
    securityGuideId: securityGuidesId,
    profileId: profileId2,
    offset,
    limit,
  });
  const ruleTreeQuery = useProfileTree({
    securityGuideId: securityGuidesId,
    profileId: profileId2,
  });

  return (
    <PolicyRulesBase
      query={query}
      v2={v2}
      ruleTreeQuery={ruleTreeQuery}
      offset={offset}
      setOffset={setOffset}
      limit={limit}
    />
  );
};

PolicyRulesRest.propTypes = {
  v2: propTypes.bool,
};

const PolicyRulesBase = ({ query, v2, ruleTreeQuery, setOffset, limit }) => {
  const { data, loading } = query;
  const { data: rulesTreeData, loading: rulesTreeLoading } = ruleTreeQuery;
  const [allData, setAllData] = useState([]); // Store accumulated data
  const [hasMore, setHasMore] = useState(true); // Keep track if more data is available
  const [isPageLoading, setIsPageLoading] = useState(false); // Separate loading state for pagination

  // Use effect to handle new data fetching and appending logic
  useEffect(() => {
    if (data && !loading && data?.data.length > 0) {
      // Append the new data to the existing data
      setAllData((prevData) => [...prevData, ...data.data]);

      // Check if there is more data to fetch based on meta info
      if (data.meta && data.meta.offset + data.meta.limit < data.meta.total) {
        // Trigger the next page by increasing the offset
        setOffset((prevOffset) => prevOffset + limit);
      } else {
        setHasMore(false); // No more data to fetch
      }
      setIsPageLoading(false);
    }
  }, [data, loading, setOffset, limit]);

  if (isPageLoading || rulesTreeLoading) {
    return (
      <PageHeader>
        <Spinner />
      </PageHeader>
    );
  }
  // Example hardcoded data (replace with actual data)
  const policyTitle =
    'CNSSI 1253 Low/Low/Low Control Baseline for Red Hat Enterprise Linux 7';
  const profileId2 = '0a036ede-252e-4e73-bdd8-9203f93deefe';

  // Determine profile and rules depending on v2 (REST) or not (GraphQL)
  const profile = v2 ? [{ id: profileId2, name: policyTitle }] : data?.profile;
  const rules = v2 ? allData : data?.profile?.rules;

  return (
    <React.Fragment>
      <PolicyRulesHeader
        name={v2 ? policyTitle : data?.profile?.name}
        benchmarkVersion={
          v2 ? 'passed in ParamTitle' : data?.profile?.benchmark?.version
        }
        osMajorVersion={
          v2 ? 'passedIn paramMajor' : data?.profile?.osMajorVersion
        }
      />
      {allData.length > 0 && (
        <div className="pf-v5-u-p-xl" style={{ background: '#fff' }}>
          {v2 ? (
            <TableStateProvider>
              <RulesTableRest
                remediationsEnabled={false}
                columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
                rules={rules}
                ruleValues={{}}
                options={{ pagination: false, manageColumns: false }}
                ruleTree={rulesTreeData}
              />
            </TableStateProvider>
          ) : (
            <RulesTable
              remediationsEnabled={false}
              columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
              loading={isPageLoading}
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
      )}
    </React.Fragment>
  );
};

PolicyRulesBase.propTypes = {
  query: propTypes.func,
  v2: propTypes.bool,
  ruleTreeQuery: propTypes.func,
  offset: propTypes.number,
  setOffset: propTypes.func,
  limit: propTypes.number,
};

const PolicyRulesWrapper = () => {
  //TODO: replace with new url params once passed in
  // const { policy_id: policyId } = useParams();
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
