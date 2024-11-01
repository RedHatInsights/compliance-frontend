import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { Grid } from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import {
  LinkWithPermission as Link,
  ErrorPage,
  LoadingPoliciesTable,
  PoliciesTable,
  StateView,
  StateViewPart,
  LinkButton,
} from 'PresentationalComponents';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import dataSerialiser from 'Utilities/dataSerialiser';
import { QUERY, dataMap } from './constants';
import GatedComponents from '@/PresentationalComponents/GatedComponents';

export const CompliancePoliciesBase = ({ query }) => {
  const CreateLink = () => (
    <Link
      to="/scappolicies/new"
      Component={LinkButton}
      componentProps={{
        variant: 'primary',
        ouiaId: 'CreateNewPolicyButton',
      }}
    >
      Create new policy
    </Link>
  );

  let { data, error, loading } = query;

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
      <section className="pf-v5-c-page__main-section">
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

CompliancePoliciesBase.propTypes = {
  query: PropTypes.shape({
    data: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
    refetch: PropTypes.func,
  }),
};

const CompliancePoliciesV2 = () => {
  const query = usePolicies();

  const data = query.data?.data
    ? {
        profiles: {
          edges: query.data.data.map((policy) => ({
            node: dataSerialiser(policy, dataMap),
          })),
        },
      }
    : null;

  return <CompliancePoliciesBase query={{ ...query, data }} />;
};

const CompliancePoliciesGraphQL = () => {
  const query = useQuery(QUERY);
  return <CompliancePoliciesBase query={query} />;
};

const CompliancePoliciesWrapper = () => (
  <GatedComponents
    RestComponent={CompliancePoliciesV2}
    GraphQLComponent={CompliancePoliciesGraphQL}
  />
);

export default CompliancePoliciesWrapper;
