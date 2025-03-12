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
import usePoliciesCount from 'Utilities/hooks/usePoliciesCount';
import CreateLink from 'SmartComponents/CompliancePolicies/components/CreateLink';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';

const CompliancePolicies = () => {
  // Async table needs info about total policy count before mounting
  // Also required for correctly showing empty state
  const totalPolicies = usePoliciesCount();
  let totalPoliciesLoading = totalPolicies == null;

  let {
    data: { data, meta: { total: currentTotalPolicies } = {} } = {},
    error,
    loading,
    exporter,
  } = usePolicies({
    useTableState: true,
    batch: { batchSize: 10 },
  });

  let showTable = data || !totalPoliciesLoading;

  if (showTable) {
    if (data) {
      error = undefined;
    }
    totalPoliciesLoading = undefined;
  }
  // Async table always needs one total value
  const calculatedTotal = currentTotalPolicies ?? totalPolicies;

  if (error) {
    totalPoliciesLoading = undefined;
    showTable = undefined;
  }

  return (
    <React.Fragment>
      <PageHeader className="page-header">
        <PageHeaderTitle title="SCAP policies" />
      </PageHeader>
      <section className="pf-v5-c-page__main-section">
        <StateView
          stateValues={{
            error,
            loading: totalPoliciesLoading,
            showTable: showTable,
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
                policies={data}
                total={calculatedTotal}
                loading={loading}
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
