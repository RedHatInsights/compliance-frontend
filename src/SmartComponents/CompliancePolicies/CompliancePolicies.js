import React from 'react';
import { Grid, Spinner } from '@patternfly/react-core';
import {
  ErrorPage,
  PoliciesTable,
  StateView,
  StateViewPart,
} from 'PresentationalComponents';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import CreateLink from 'SmartComponents/CompliancePolicies/components/CreateLink';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import CompliancePageHeader from 'PresentationalComponents/CompliancePageHeader/CompliancePageHeader';
import { policiesPopoverData } from '@/constants';

const CompliancePolicies = () => {
  // Async table needs info about total policy count before mounting
  // Also required for correctly showing empty state
  const {
    data: totalPolicies,
    error: totalPoliciesError,
    loading: totalPoliciesLoading,
  } = usePolicies({
    onlyTotal: true,
  });

  let {
    data: { data, meta: { total: currentTotalPolicies } = {} } = {},
    error: policiesError,
    loading: policiesLoading,
    exporter,
  } = usePolicies({
    useTableState: true,
    batch: { batchSize: 10 },
  });
  const error = policiesError || totalPoliciesError;

  return (
    <React.Fragment>
      <CompliancePageHeader
        mainTitle={'SCAP policies'}
        popoverData={policiesPopoverData}
      />
      <section className="pf-v6-c-page__main-section">
        <StateView
          stateValues={{
            error: error,
            loading: totalPoliciesLoading,
            showTable: totalPolicies !== undefined && !error,
          }}
        >
          <StateViewPart stateKey="error">
            <ErrorPage error={error} />
          </StateViewPart>
          <StateViewPart stateKey="loading">
            <Spinner />
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
                total={currentTotalPolicies}
                loading={policiesLoading}
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
