import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReports } from '../../Utilities/hooks/api/useReports';
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
// import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import { useQuery, gql } from '@apollo/client';

const QUERY = gql`
  query R_Profiles($filter: String!) {
    profiles(search: $filter, limit: 1000) {
      edges {
        node {
          id
          refId
        }
      }
    }
  }
`;
const reportIdsFromEdges = (data) =>
  (data?.profiles?.edges || []).map((profile) => profile.node);

//TODO: remove completely after ReportDownload page is migrated
const replaceOldReportId = (data = [], dataFromGQL) =>
  data.map((reportFromRest) => ({
    ...reportFromRest,
    oldId:
      dataFromGQL.find(
        (reportFromGQL) => reportFromGQL.refId === reportFromRest.ref_id
      )?.id || reportFromRest.id,
  }));

const ReportsHeader = () => (
  <PageHeader>
    <PageHeaderTitle title="Reports" />
  </PageHeader>
);

export const Reports = () => {
  // uncomment for development of API serialisers
  // const serialisedTableState = useSerialisedTableState();
  // console.log('Async TableState', serialisedTableState);

  let showView = false;
  const location = useLocation();
  const filter = `has_policy_test_results = true AND external = false`;

  let {
    data: { data },
    error,
    loading,
    refetch,
  } = useReports(filter);

  //TODO: remove completely after ReportDownload page is migrated
  let {
    data: dataFromGQL,
    error: errorFromGQL,
    loading: loadingFromGQL,
    refetch: refetchFromGQL,
  } = useQuery(QUERY, {
    variables: { filter },
  });

  useEffect(() => {
    refetch();
    refetchFromGQL();
  }, [location, refetch]);

  if (data && dataFromGQL) {
    data = replaceOldReportId(data, reportIdsFromEdges(dataFromGQL));
    error = undefined;
    loading = undefined;
    showView = data && data.length > 0;
  }

  return (
    <>
      <ReportsHeader />
      <StateViewWithError
        stateValues={{
          error: error || errorFromGQL,
          loading: loading || loadingFromGQL,
          data,
        }}
      >
        <StateViewPart stateKey="loading">
          <section className="pf-v5-c-page__main-section">
            <SkeletonTable colSize={3} rowSize={10} />
          </section>
        </StateViewPart>
        <StateViewPart stateKey="data">
          <section className="pf-v5-c-page__main-section">
            {showView ? (
              <ReportsTable profiles={data} />
            ) : (
              <ReportsEmptyState />
            )}
          </section>
        </StateViewPart>
      </StateViewWithError>
    </>
  );
};

const ReportsWithTableStateProvider = () => (
  <TableStateProvider>
    <Reports />
  </TableStateProvider>
);

export default ReportsWithTableStateProvider;
