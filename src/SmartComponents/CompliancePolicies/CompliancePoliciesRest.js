import React, { useCallback } from 'react';
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
import { dataMap } from './constants';
import usePoliciesCount from 'Utilities/hooks/usePoliciesCount';
import useExporter from '@/Frameworks/AsyncTableTools/hooks/useExporter';

const CompliancePoliciesRest = () => {
  // Async table needs info about total policy count before mounting
  // Also required for correctly showing empty state
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
    policies = data;
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

export default CompliancePoliciesRest;
