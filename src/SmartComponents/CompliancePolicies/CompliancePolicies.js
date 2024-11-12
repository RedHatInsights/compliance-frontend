import React, { useEffect } from 'react';
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
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import usePoliciesCount from 'Utilities/hooks/usePoliciesCount';

export const CompliancePoliciesBase = ({ query, numberOfItems }) => {
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

  if (data || numberOfItems != null) {
    error = undefined;
    loading = undefined;
    if (data) {
      policies = data.profiles.edges.map((profile) => profile.node);
    } else {
      data = [];
      policies = [];
    }
  }

  console.log(numberOfItems);
  console.log(error, loading, data, policies);

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
            {numberOfItems === 0 ? (
              // {numberOfItems === 0 || (policies && policies.length === 0) ? (
              <Grid hasGutter>
                <ComplianceEmptyState
                  title="No policies"
                  mainButton={<CreateLink />}
                />
              </Grid>
            ) : (
              <PoliciesTable
                policies={policies}
                DedicatedAction={CreateLink}
                numberOfItems={numberOfItems}
              />
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
  const numberOfItems = usePoliciesCount();
  const options = {
    useTableState: true,
  };
  let {
    data: { data, meta: { total } = {} } = {},
    error,
    loading,
    refetch,
  } = usePolicies(options);

  if (data) {
    data = {
      profiles: {
        edges: data.map((policy) => ({
          node: dataSerialiser(policy, dataMap),
        })),
      },
    };

    error = undefined;
    loading = undefined;
  }

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

  let policies;

  if (data || numberOfItems != null) {
    error = undefined;
    loading = undefined;
    if (data) {
      policies = data.profiles.edges.map((profile) => profile.node);
    } else {
      data = [];
      policies = [];
    }
  }

  console.log(numberOfItems);
  console.log(error, loading, data, policies);

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
            {numberOfItems === 0 ? (
              <Grid hasGutter>
                <ComplianceEmptyState
                  title="No policies"
                  mainButton={<CreateLink />}
                />
              </Grid>
            ) : (
              <PoliciesTable
                policies={policies}
                DedicatedAction={CreateLink}
                numberOfItems={numberOfItems}
              />
            )}
          </StateViewPart>
        </StateView>
      </section>
    </React.Fragment>
  );
};

const CompliancePoliciesGraphQL = () => {
  const query = useQuery(QUERY);
  return <CompliancePoliciesBase query={query} />;
};

const CompliancePoliciesWrapper = () => (
  <TableStateProvider>
    <GatedComponents
      RestComponent={CompliancePoliciesV2}
      GraphQLComponent={CompliancePoliciesGraphQL}
    />
  </TableStateProvider>
);

export default CompliancePoliciesWrapper;
