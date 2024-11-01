import React, { useEffect } from 'react';
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
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import PropTypes from 'prop-types';
import useReports from 'Utilities/hooks/api/useReports';
import dataSerialiser from 'Utilities/dataSerialiser';
import { QUERY } from './constants';
import { reportDataMap as dataMap } from '../../constants';
import GatedComponents from '@/PresentationalComponents/GatedComponents';

const profilesFromEdges = (data) =>
  (data?.profiles?.edges || []).map((profile) => profile.node);

const ReportsHeader = () => (
  <PageHeader>
    <PageHeaderTitle title="Reports" />
  </PageHeader>
);

export const ReportsBase = ({ data, loading, error }) => {
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
            {showView ? <ReportsTable reports={data} /> : <ReportsEmptyState />}
          </section>
        </StateViewPart>
      </StateViewWithError>
    </>
  );
};

ReportsBase.propTypes = {
  data: PropTypes.array,
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

  return <ReportsBase {...{ data: profiles, error, loading, refetch }} />;
};

const ReportsWithRest = () => {
  const options = {
    params: {
      filter: 'with_reported_systems = true',
    },
  };
  let { data: { data } = {}, error, loading, refetch } = useReports(options);

  if (data) {
    data = dataSerialiser(data, dataMap);
    error = undefined;
    loading = undefined;
  }

  return <ReportsBase {...{ data, error, loading, refetch }} />;
};

const ReportsWrapper = () => (
  <GatedComponents
    RestComponent={ReportsWithRest}
    GraphQLComponent={ReportsWithGrahpQL}
  />
);

const ReportsWithTableStateProvider = () => (
  <TableStateProvider>
    <ReportsWrapper />
  </TableStateProvider>
);

export default ReportsWithTableStateProvider;
