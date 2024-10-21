import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import propTypes from 'prop-types';
import PageHeader, {
} from '@redhat-cloud-services/frontend-components/PageHeader';
import RulesTable from '../../PresentationalComponents/RulesTable/RulesTable';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import { Spinner} from '@patternfly/react-core';
import { usePolicyRulesList } from './usePolicyRulesList';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';
import PolicyRulesHeader from './PolicyRulesHeader';
import { useProfileTree } from './useProfileTree';

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

const PolicyRulesGraphQL = ({v2}) => {
const { policy_id: policyId } = useParams();
const query = useQuery(PROFILES_QUERY, {
  variables: {
    policyId: policyId,
  },
});  
return (
  <PolicyRulesBase
    query={query}
    v2={v2}
  />
);
}

PolicyRulesGraphQL.propTypes = {
  v2: propTypes.bool,
}; 

const PolicyRulesRest = ({v2}) => {
  //TODO: Replace with urlParams 
  const  profileId2 = '0a036ede-252e-4e73-bdd8-9203f93deefe';
  const securityGuidesId = "3e01872b-e90d-46bb-9b39-012adc00d9b9";
  const query = usePolicyRulesList(securityGuidesId, profileId2);
  const ruleTreeQuery = useProfileTree(securityGuidesId, profileId2)  
return (
  <PolicyRulesBase
    query={query}
    v2={v2}
    ruleTreeQuery={ruleTreeQuery}
  />
);
}

PolicyRulesRest.propTypes = {
  v2: propTypes.bool,
}; 


const PolicyRulesBase = ({ query, v2, ruleTreeQuery }) => {
  const { data, error, loading } = query;
  const { data: rulesTreeData, rulesTreeLoading } = query;

  //just examples, replace with actual data once url is upgraded
  const policyTitle = 'CNSSI 1253 Low/Low/Low Control Baseline for Red Hat Enterprise Linux 7'
  const  profileId2 = '0a036ede-252e-4e73-bdd8-9203f93deefe';

  return loading  && rulesTreeLoading? (
    <PageHeader>
      <Spinner />
    </PageHeader>
  ) : (
    <React.Fragment>
      <PolicyRulesHeader 
        name={v2 ? policyTitle :data?.profile.name}
        benchmarkVersion={v2 ? 'passed in ParamTitle' : data?.profile.benchmark.version} 
        osMajorVersion={v2 ?'passedIn paramMajor' : data?.profile.osMajorVersion} 
      />
      {data && (
        <div className="pf-v5-u-p-xl" style={{ background: '#fff' }}>
          <RulesTable
            remediationsEnabled={false}
            columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
            loading={loading}
            profileRules={[
              {
                profile: v2 ? [{id: profileId2, name: policyTitle}] : data.profile,
                rules: v2 ? data.data : data.profile.rules,
              },
            ]}
            options={{ pagination: false, manageColumns: false }}
            apiV2Enabled={v2}
            //TODO: pass in rulesTreeData to new Rules table
            // ruleTree={rulesTreeData}
          />
        </div>
      )}
    </React.Fragment>
  );
}

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

  return <PolicyRules v2={apiV2Enabled}/>;
};

PolicyRules.propTypes = {
  v2: propTypes.bool,
};

export default PolicyRulesWrapper;
