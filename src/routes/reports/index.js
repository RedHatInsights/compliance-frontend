import React from 'react';
import { Spinner } from '@patternfly/react-core';
import { TableStateProvider } from 'bastilian-tabletools';
import useReports from 'Utilities/hooks/api/useReports';
import useReportsOS from 'Utilities/hooks/api/useReportsOs';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';

import { CompliancePageHeader } from '~/_components';

import { REPORTS_FILTER, reportsPopoverData } from './constants';

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
    data: { data: reports, meta: { total } = {} } = {},
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

  return (
    <React.Fragment>
      <CompliancePageHeader
        mainTitle={'Reports'}
        popoverData={reportsPopoverData}
      />
      <section className="pf-v5-c-page__main-section">
        <StateViewWithError
          stateValues={{
            error,
            loading,
            data: !loading,
          }}
        >
          <StateViewPart stateKey="loading">
            <Spinner />
          </StateViewPart>
          <StateViewPart stateKey="data">
            {totalReports === 0 ? (
              <ReportsEmptyState />
            ) : (
              <ReportsTable
                reports={reports}
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
