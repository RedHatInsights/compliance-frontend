import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import useReportsFetch from '../../Utilities/hooks/useReportsFetch';

const profilesFromEdges = (data) => {
  // console.log('data', data);
  const edges = (data || []).map((page) => page.data.profiles.edges).flat();
  console.log('edges', edges);

  if (edges.length > 0) {
    return edges.map((x) => x.node);
  }
};

const ReportsHeader = () => (
  <PageHeader>
    <PageHeaderTitle title="Reports" />
  </PageHeader>
);

export const Reports = () => {
  let profiles = [];
  let showView = false;
  const location = useLocation();
  // const filter = `has_policy_test_results = true AND external = false`;

  let { loading, data, fetch } = useReportsFetch();
  let error = data?.error;

  useEffect(() => {
    console.log('fetch');
    fetch();
  }, [location]);

  if (data) {
    profiles = profilesFromEdges(data);
    console.log('profiles', profiles);
    error = undefined;
    loading = undefined;
    showView = profiles && profiles.length > 0;
  }

  return (
    <>
      <ReportsHeader />
      <StateViewWithError stateValues={{ error, data, loading }}>
        <StateViewPart stateKey="loading">
          <section className="pf-c-page__main-section">
            <SkeletonTable colSize={3} rowSize={10} />
          </section>
        </StateViewPart>
        <StateViewPart stateKey="data">
          <section className="pf-c-page__main-section">
            {showView ? (
              <ReportsTable {...{ profiles }} />
            ) : (
              <ReportsEmptyState />
            )}
          </section>
        </StateViewPart>
      </StateViewWithError>
    </>
  );
};

export default Reports;
