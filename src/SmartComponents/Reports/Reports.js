import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import dataSerialiser from 'Utilities/dataSerialiser';
import { reportDataMap as dataMap } from '../../constants';
import { uniq } from 'Utilities/helpers';
import { QUERY } from './constants';
import useReportsExporter from './hooks/useReportsExporter';

const profilesFromEdges = (data) =>
  (data?.profiles?.edges || []).map((profile) => profile.node);

const ReportsHeader = () => (
  <PageHeader>
    <PageHeaderTitle title="Reports" />
  </PageHeader>
);

export const ReportsBase = ({ data, loading, error, operatingSystems }) => {
  const showView = data && data.length > 0;
  return (
    <>
      <ReportsHeader />
      <StateViewWithError stateValues={{ error, data, loading }}>
        <StateViewPart stateKey="loading">
          <section className="pf-v5-c-page__main-section">
            <SkeletonTable colSize={3} rowSize={10} />
          </section>
        </StateViewPart>
        <StateViewPart stateKey="data">
          <section className="pf-v5-c-page__main-section">
            {showView ? (
              <ReportsTable
                reports={data}
                operatingSystems={operatingSystems}
              />
            ) : (
              <ReportsEmptyState />
            )}
          </section>
        </StateViewPart>
      </StateViewWithError>
    </>
  );
};

ReportsBase.propTypes = {
  data: PropTypes.array,
  operatingSystems: PropTypes.array,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

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
  const policyTypes =
    data &&
    uniq(profiles?.map(({ policyType }) => policyType).filter((i) => !!i));

  return (
    <ReportsBase
      {...{
        data: profiles,
        operatingSystems,
        policyTypes,
        error,
        loading,
        refetch,
      }}
    />
  );
};

const ReportsWithRest = () => {
  const { data: operatingSystems } = useReportsOS();
  const {
    data: { data: reportsData, meta: { total } = {} } = {},
    fetch: fetchReports,
    error,
  } = useComplianceQuery('reports', {
    params: { filter: 'with_reported_systems = true' },
    useTableState: true,
    debounced: false,
  });
  const fetchForExport = useCallback(
    async (offset, limit) => await fetchReports({ offset, limit }, false),
    [fetchReports]
  );
  const reportsExporter = useReportsExporter(fetchForExport);
  const serialisedData = reportsData && dataSerialiser(reportsData, dataMap);
  const data = operatingSystems;
  const loading = !data ? true : undefined;

  return (
    <StateViewWithError stateValues={{ error, data, loading }}>
      <StateViewPart stateKey="loading">
        <section className="pf-v5-c-page__main-section">
          <SkeletonTable colSize={3} rowSize={10} />
        </section>
      </StateViewPart>
      <StateViewPart stateKey="data">
        <ReportsHeader />
        <section className="pf-v5-c-page__main-section">
          <ReportsTable
            reports={serialisedData}
            operatingSystems={operatingSystems}
            total={total}
            options={{
              exporter: async () =>
                dataSerialiser(await reportsExporter(), dataMap),
            }}
          />
        </section>
      </StateViewPart>
    </StateViewWithError>
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
