import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import propTypes from 'prop-types';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import RulesTable from '../../PresentationalComponents/RulesTable/RulesTable';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import { Spinner, Text, TextContent } from '@patternfly/react-core';

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

const PolicyRules = () => {
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
    <React.Fragment>
      <PageHeader className="pf-v5-u-pt-xl pf-v5-u-pl-xl">
        <PageHeaderTitle
          title={`Compliance | Default rules for ${data?.profile.name} policy`}
        />
        <TextContent className="pf-v5-u-mb-md pf-v5-u-mt-md">
          <Text>
            This is a read-only view of the full set of rules and their
            description for
            <b>{data?.profile.name} policy</b> operating on
            <br />
            <b>RHEL {data?.profile.osMajorVersion}</b> -{' '}
            <b>SSG version: {data?.profile.benchmark.version}</b>
          </Text>
          <Text>Rule selection must be made in the policy modal</Text>
        </TextContent>
      </PageHeader>
      {data && (
        <div className="pf-v5-u-p-xl" style={{ background: '#fff' }}>
          <RulesTable
            remediationsEnabled={false}
            columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
            loading={loading}
            profileRules={[
              {
                profile: data.profile,
                rules: data.profile.rules,
              },
            ]}
            options={{ pagination: false, manageColumns: false }}
          />
        </div>
      )}
    </React.Fragment>
  );
};

PolicyRules.propTypes = {
  loading: propTypes.bool,
  policy: propTypes.shape({
    name: propTypes.string,
    refId: propTypes.string,
    rules: propTypes.array,
    benchmark: propTypes.object,
  }),
};
export default PolicyRules;
