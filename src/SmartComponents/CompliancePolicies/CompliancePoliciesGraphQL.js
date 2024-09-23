import React from 'react';
import { useQuery } from '@apollo/client';
import { CreateLink, QUERY } from './constants';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  ErrorPage,
  LoadingPoliciesTable,
  PoliciesTable,
  StateView,
  StateViewPart,
} from '../../PresentationalComponents';
import ComplianceEmptyState from '../../PresentationalComponents/ComplianceEmptyState';
import { Grid } from '@patternfly/react-core';

export const CompliancePoliciesGraphQL = () => {
  const query = useQuery(QUERY);
  let { data, error, loading } = query;
  let policies;

  if (data) {
    error = undefined;
    loading = undefined;
    policies = data.profiles.edges.map((profile) => profile.node);
  }

  return (
    <>
      <StateView stateValues={{ error, data, loading }}>
        <StateViewPart stateKey="error">
          <ErrorPage error={error} />
        </StateViewPart>
        <StateViewPart stateKey="loading">
          <LoadingPoliciesTable />
        </StateViewPart>
        <StateViewPart stateKey="data">
          {policies && policies.length === 0 ? (
            <Grid hasGutter>
              <ComplianceEmptyState
                title="No policies"
                mainButton={<CreateLink />}
              />
            </Grid>
          ) : (
            <PoliciesTable policies={policies} DedicatedAction={CreateLink} />
          )}
        </StateViewPart>
      </StateView>
      )
    </>
  );
};

export default CompliancePoliciesGraphQL;
