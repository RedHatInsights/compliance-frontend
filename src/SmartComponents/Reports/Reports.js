import React from 'react';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Spinner } from '@patternfly/react-core';
import {
  ReportsTable,
  StateViewPart,
  StateViewWithError,
  ReportsEmptyState,
} from 'PresentationalComponents';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import useReports from 'Utilities/hooks/api/useReports';
import useReportsOS from 'Utilities/hooks/api/useReportsOs';

const ReportsHeader = () => (
  <PageHeader>
    <PageHeaderTitle title="Reports" />
  </PageHeader>
);
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
    params: { filter: REPORTS_FILTER },
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
    params: { filter: REPORTS_FILTER },
    useTableState: true,
    batch: { batchSize: 10 },
  });
  const loading = totalReportsLoading || reportsOSLoading;
  const error = totalReportsError || reportsOSError || reportsError;
  const showTable =
    totalReports !== undefined && operatingSystems !== undefined && !error;

  return (
    <React.Fragment>
      <ReportsHeader />
      <section className="pf-v5-c-page__main-section">
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
