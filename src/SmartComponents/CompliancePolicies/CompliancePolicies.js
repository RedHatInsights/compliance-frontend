import React, { useCallback } from 'react';
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
import useExporter from '@/Frameworks/AsyncTableTools/hooks/useExporter';

export const CompliancePoliciesGraphQL = () => {
  let { data, error, loading } = useQuery(QUERY);

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

  if (data) {
    error = undefined;
    loading = undefined;
    if (data) {
      policies = data.profiles.edges.map((profile) => profile.node);
    } else {
      data = [];
      policies = [];
    }
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

CompliancePoliciesGraphQL.propTypes = {
  query: PropTypes.shape({
    data: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
    refetch: PropTypes.func,
  }),
};

const CompliancePoliciesV2 = () => {
  // Async table needs info about total policy count before mounting
  const totalPolicies = usePoliciesCount();
  const totalPoliciesLoaded = totalPolicies != null;

  const options = {
    useTableState: true,
  };

  let {
    data: { data, meta: { total: currentTotalPolicies } = {} } = {},
    error,
    loading,
    fetch: fetchPolicies,
  } = usePolicies(options);

  const fetchForExport = useCallback(
    async (offset, limit) => await fetchPolicies({ offset, limit }, false),
    [fetchPolicies]
  );

  const policiesExporter = useExporter(fetchForExport);

  if (data) {
    data = dataSerialiser(data, dataMap);
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

  if (data || totalPolicies != null) {
    error = undefined;
    loading = undefined;
    policies = data ?? [];
  }

  // Async table always needs one total value
  const calculatedTotal = currentTotalPolicies ?? totalPolicies;

  return (
    <React.Fragment>
      <PageHeader className="page-header">
        <PageHeaderTitle title="SCAP policies" />
      </PageHeader>
      <section className="pf-v5-c-page__main-section">
        <StateView
          stateValues={{ error, loaded: totalPoliciesLoaded, loading }}
        >
          <StateViewPart stateKey="error">
            <ErrorPage error={error} />
          </StateViewPart>
          <StateViewPart stateKey="loading">
            <LoadingPoliciesTable />
          </StateViewPart>
          <StateViewPart stateKey="loaded">
            {totalPolicies === 0 ? (
              <Grid hasGutter>
                <ComplianceEmptyState
                  title="No policies"
                  mainButton={<CreateLink />}
                />
              </Grid>
            ) : (
              <PoliciesTable
                policies={policies}
                total={calculatedTotal}
                DedicatedAction={CreateLink}
                options={{
                  exporter: async () =>
                    dataSerialiser(await policiesExporter(), dataMap),
                }}
              />
            )}
          </StateViewPart>
        </StateView>
      </section>
    </React.Fragment>
  );
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
