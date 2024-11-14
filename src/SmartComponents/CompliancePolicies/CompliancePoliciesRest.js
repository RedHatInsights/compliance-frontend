import React, { useCallback } from 'react';
import { Grid } from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import {
  ErrorPage,
  LoadingPoliciesTable,
  PoliciesTable,
  StateView,
  StateViewPart,
} from 'PresentationalComponents';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import dataSerialiser from 'Utilities/dataSerialiser';
import { dataMap } from './constants';
import usePoliciesCount from 'Utilities/hooks/usePoliciesCount';
import useExporter from '@/Frameworks/AsyncTableTools/hooks/useExporter';
import CreateLink from 'SmartComponents/CompliancePolicies/components/CreateLink';

const CompliancePoliciesRest = () => {
  // Async table needs info about total policy count before mounting
  // Also required for correctly showing empty state
  const totalPolicies = usePoliciesCount();
  let totalPoliciesLoading = totalPolicies == null;

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

  let showTable = data || !totalPoliciesLoading;

  if (showTable) {
    if (data) {
      data = dataSerialiser(data, dataMap);
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

export default CompliancePoliciesRest;
