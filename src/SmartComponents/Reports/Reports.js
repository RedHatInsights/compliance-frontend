import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
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

const QUERY = gql`
  query R_Profiles($filter: String!) {
    profiles(search: $filter, limit: 1000) {
      edges {
        node {
          id
          name
          refId
          description
          policyType
          totalHostCount
          testResultHostCount
          compliantHostCount
          unsupportedHostCount
          osMajorVersion
          complianceThreshold
          businessObjective {
            id
            title
          }
          policy {
            id
            name
          }
          benchmark {
            id
            version
          }
        }
      }
    }
  }
`;

const profilesFromEdges = (data) =>
  (data?.profiles?.edges || []).map((profile) => profile.node);

const ReportsHeader = () => (
  <PageHeader>
    <PageHeaderTitle title="Reports" />
  </PageHeader>
);

export const Reports = () => {
  let profiles = [];
  let showView = false;
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
    showView = profiles && profiles.length > 0;
  }

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

const ReportsWithTableStateProvider = () => (
  <TableStateProvider>
    <Reports />
  </TableStateProvider>
);

export default ReportsWithTableStateProvider;
