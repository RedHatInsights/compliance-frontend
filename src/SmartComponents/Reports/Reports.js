import React, { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
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
import GatedComponents from '@/PresentationalComponents/GatedComponents';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import useComplianceQuery from 'Utilities/hooks/api/useComplianceQuery';
import useReportsOS from 'Utilities/hooks/api/useReportsOs';
import useReportsCount from 'Utilities/hooks/useReportsCount';
import dataSerialiser from 'Utilities/dataSerialiser';
import { reportDataMap as dataMap } from '../../constants';
import { uniq } from 'Utilities/helpers';
import { QUERY } from './constants';
import useExporter from '@/Frameworks/AsyncTableTools/hooks/useExporter';

const profilesFromEdges = (data) =>
  (data?.profiles?.edges || []).map((profile) => profile.node);

const ReportsHeader = () => (
  <PageHeader>
    <PageHeaderTitle title="Reports" />
  </PageHeader>
);

//deprecated component
const ReportsWithGrahpQL = () => {
  let profiles = [];
  const location = useLocation();
  const filter = `has_policy_test_results = true AND external = false`;

  let { data, error, loading, refetch } = useQuery(QUERY, {
    variables: { filter },
  });

  useEffect(() => {
    refetch();
  }, [location, refetch]);

  if (data) {
    profiles = profilesFromEdges(data);
    error = undefined;
    loading = undefined;
  }
  const operatingSystems =
    data &&
    uniq(
      profiles?.map(({ osMajorVersion }) => osMajorVersion).filter((i) => !!i)
    );

  return (
    <>
      <ReportsHeader />
      <section className="pf-v5-c-page__main-section">
        <StateViewWithError stateValues={{ error, data: profiles, loading }}>
          <StateViewPart stateKey="loading">
            <SkeletonTable colSize={3} rowSize={10} />
          </StateViewPart>
          <StateViewPart stateKey="data">
            {profiles && profiles.length > 0 ? (
              <ReportsTable
                reports={profiles}
                operatingSystems={operatingSystems}
              />
            ) : (
              <ReportsEmptyState />
            )}
          </StateViewPart>
        </StateViewWithError>
      </section>
    </>
  );
};

const ReportsWithRest = () => {
  // Required for correctly showing empty state
  const totalReports = useReportsCount();

  const { data: operatingSystems } = useReportsOS();
  const {
    data: { data: reportsData, meta: { total } = {} } = {},
    error,
    loading: reportsLoading,
    fetch: fetchReports,
  } = useComplianceQuery('reports', {
    params: { filter: 'with_reported_systems = true' },
    useTableState: true,
    debounced: false,
  });
  const fetchForExport = useCallback(
    async (offset, limit) => await fetchReports({ offset, limit }, false),
    [fetchReports]
  );
  const reportsExporter = useExporter(fetchForExport);
  const serialisedData = reportsData && dataSerialiser(reportsData, dataMap);
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
                reports={serialisedData}
                operatingSystems={operatingSystems}
                total={total}
                loading={reportsLoading}
                options={{
                  exporter: async () =>
                    dataSerialiser(await reportsExporter(), dataMap),
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
    <ReportsWithRest />
  </TableStateProvider>
);

const ReportsWrapper = () => (
  <GatedComponents
    RestComponent={ReportsWithTableStateProvider}
    GraphQLComponent={ReportsWithGrahpQL}
  />
);

export default ReportsWrapper;
