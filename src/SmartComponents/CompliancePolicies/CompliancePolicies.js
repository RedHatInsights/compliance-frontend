import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Grid } from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import {
  BackgroundLink,
  ErrorPage,
  LoadingPoliciesTable,
  PoliciesTable,
  StateView,
  StateViewPart,
  LinkButton,
} from 'PresentationalComponents';

const QUERY = gql`
  {
    profiles(search: "external = false and canonical = false") {
      edges {
        node {
          id
          name
          description
          refId
          complianceThreshold
          totalHostCount
          osMajorVersion
          policyType
          policy {
            id
            name
          }
          businessObjective {
            id
            title
          }
        }
      }
    }
  }
`;

export const CompliancePolicies = () => {
  const location = useLocation();
  const CreateLink = () => (
    <BackgroundLink
      to="/scappolicies/new"
      Component={LinkButton}
      componentProps={{
        variant: 'primary',
        ouiaId: 'CreateNewPolicyButton',
      }}
    >
      Create new policy
    </BackgroundLink>
  );

  let { data, error, loading, refetch } = useQuery(QUERY);
  useEffect(() => {
    refetch();
  }, [location, refetch]);
  let policies;

  if (data) {
    error = undefined;
    loading = undefined;
    policies = data.profiles.edges.map((profile) => profile.node);
  }

  return (
    <React.Fragment>
      <PageHeader className="page-header">
        <PageHeaderTitle title="SCAP policies" />
      </PageHeader>
      <section className="pf-c-page__main-section">
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
      </section>
    </React.Fragment>
  );
};

export default CompliancePolicies;
