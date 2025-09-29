import React from 'react';
import { Spinner } from '@patternfly/react-core';
import {
  ReportsTable,
  StateViewPart,
  StateViewWithError,
  ReportsEmptyState,
} from 'PresentationalComponents';
import { TableStateProvider } from 'bastilian-tabletools';

import useReports from 'Utilities/hooks/api/useReports';
import useReportsOS from 'Utilities/hooks/api/useReportsOs';
import CompliancePageHeader from 'PresentationalComponents/CompliancePageHeader/CompliancePageHeader';
import { reportsPopoverData } from '@/constants';

const REPORTS_FILTER = 'with_reported_systems = true';

const Reports = () => {
  // Required for correctly showing empty state
  // TODO We can probably avoid this extra request by finishing the empty state implementation in the TableTools
  const {
    data: totalReports,
    error: totalReportsError,
    loading: totalReportsLoading,
  } = useReports({
    onlyTotal: true,
    params: { filters: REPORTS_FILTER },
  });
  const {
    data: { data: operatingSystems } = {},
    loading: reportsOSLoading,
    error: reportsOSError,
  } = useReportsOS();
  const {
    data: { data: reportsData, meta: { total } = {} } = {},
    error: reportsError,
    loading: reportsLoading,
    exporter,
  } = useReports({
    params: { filters: REPORTS_FILTER },
    useTableState: true,
    batch: { batchSize: 10 },
  });
  const loading = totalReportsLoading || reportsOSLoading;
  const error = totalReportsError || reportsOSError || reportsError;
  const showTable =
    totalReports !== undefined && operatingSystems !== undefined && !error;

  return (
    <React.Fragment>
      <CompliancePageHeader
        mainTitle={'Reports'}
        popoverData={reportsPopoverData}
      />
      <section className="pf-v6-c-page__main-section">
        <StateViewWithError
          stateValues={{
            error,
            loading,
            showTable: showTable,
          }}
        >
          <StateViewPart stateKey="loading">
            <Spinner />
          </StateViewPart>
          <StateViewPart stateKey="showTable">
            {totalReports === 0 ? (
              <ReportsEmptyState />
            ) : (
              <ReportsTable
                reports={reportsData}
                operatingSystems={operatingSystems}
                total={total}
                loading={reportsLoading}
                options={{
                  exporter,
                }}
              />
            )}
          </StateViewPart>
        </StateViewWithError>
      </section>
    </React.Fragment>
  );
};

const ReportsWithTableStateProvider = () => (
  <TableStateProvider>
    <Reports />
  </TableStateProvider>
);

export default ReportsWithTableStateProvider;
