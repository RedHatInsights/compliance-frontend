import React from 'react';
import { Grid } from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  ErrorPage,
  LoadingPoliciesTable,
  PoliciesTable,
  StateView,
  StateViewPart,
} from 'PresentationalComponents';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import CreateLink from 'SmartComponents/CompliancePolicies/components/CreateLink';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';

const CompliancePolicies = () => {
  // Async table needs info about total policy count before mounting
  // Also required for correctly showing empty state
  // TODO Same as with the reports page. We need to finish the table tools empty state
  const { data: totalPolicies, loading: totalPoliciesLoading } = usePolicies({
    onlyTotal: true,
  });
  const {
    data: { data: policies, meta } = {},
    error,
    loading,
    exporter,
  } = usePolicies({
    useTableState: true,
  });
  const showTable =
    (policies || totalPolicies) && !error && !(totalPoliciesLoading || loading);

  return (
    <React.Fragment>
      <PageHeader className="page-header">
        <PageHeaderTitle title="SCAP policies" />
      </PageHeader>
      <section className="pf-v5-c-page__main-section">
        <StateView
          stateValues={{
            error,
            loading: totalPoliciesLoading || loading,
            showTable,
          }}
        >
          <StateViewPart stateKey="error">
            <ErrorPage error={error} />
          </StateViewPart>
          <StateViewPart stateKey="loading">
            <LoadingPoliciesTable />
          </StateViewPart>
          <StateViewPart stateKey="showTable">
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
                total={meta?.total}
                DedicatedAction={CreateLink}
                options={{
                  exporter,
                }}
              />
            )}
          </StateViewPart>
        </StateView>
      </section>
    </React.Fragment>
  );
};

const PoliciesWithTableStateProvider = () => (
  <TableStateProvider>
    <CompliancePolicies />
  </TableStateProvider>
);

export default PoliciesWithTableStateProvider;
