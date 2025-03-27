import React from 'react';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import SkeletonTable from '@redhat-cloud-services/frontend-components/SkeletonTable';
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
  const { data: totalReports } = useReports({
    onlyTotal: true,
    params: { filter: REPORTS_FILTER },
  });
  const { data: { data: operatingSystems } = {} } = useReportsOS();
  const {
    data: { data: reportsData, meta: { total } = {} } = {},
    error,
    loading: reportsLoading,
    exporter,
  } = useReports({
    params: { filter: REPORTS_FILTER },
    useTableState: true,
    batch: { batchSize: 10 },
  });
  const data = operatingSystems;
  const loading = !data ? true : undefined;

  return (
    <React.Fragment>
      <ReportsHeader />
      <section className="pf-v5-c-page__main-section">
        <StateViewWithError stateValues={{ error, data, loading }}>
          <StateViewPart stateKey="loading">
            <SkeletonTable colSize={3} rowSize={10} />
          </StateViewPart>
          <StateViewPart stateKey="data">
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
