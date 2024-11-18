import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { Grid } from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import { useLocation } from 'react-router-dom';
import {
  ErrorPage,
  LoadingPoliciesTable,
  PoliciesTable,
  StateView,
  StateViewPart,
} from 'PresentationalComponents';
import CreateLink from 'SmartComponents/CompliancePolicies/components/CreateLink';

import { QUERY } from './constants';

const CompliancePoliciesGraphQL = () => {
  const location = useLocation();
  let { data, error, loading, refetch } = useQuery(QUERY);

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

  useEffect(() => {
    refetch();
  }, [location, refetch]);

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

export default CompliancePoliciesGraphQL;
