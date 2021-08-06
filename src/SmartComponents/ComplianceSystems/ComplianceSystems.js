/* eslint-disable react/display-name */
import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import Main from '@redhat-cloud-services/frontend-components/Main';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { InventoryTable } from 'SmartComponents';
import { GET_SYSTEMS } from '../SystemsTable/constants';
import * as Columns from '../SystemsTable/Columns';

const QUERY = gql`
  {
    profiles(search: "external = false and canonical = false") {
      edges {
        node {
          id
          name
          refId
          majorOsVersion
        }
      }
    }
  }
`;

const DEFAULT_FILTER = 'has_test_results = true or has_policy = true';

export const ComplianceSystems = () => {
  const { data, error, loading } = useQuery(QUERY);
  const policies = data?.profiles?.edges.map(({ node }) => node);

  return (
    <React.Fragment>
      <PageHeader className="page-header">
        <PageHeaderTitle title="Systems" />
      </PageHeader>
      <Main>
        <StateViewWithError stateValues={{ error, data, loading }}>
          <StateViewPart stateKey="data">
            {policies && (
              <InventoryTable
                columns={[
                  Columns.customName({
                    showLink: true,
                    showOsInfo: true,
                  }),
                  Columns.inventoryColumn('tags'),
                  Columns.Policies,
                  Columns.DetailsLink,
                ]}
                query={GET_SYSTEMS}
                defaultFilter={DEFAULT_FILTER}
                systemProps={{
                  isFullView: true,
                }}
                showOsMinorVersionFilter={policies.map(
                  (policy) => policy.majorOsVersion
                )}
                showComplianceSystemsInfo
                enableEditPolicy={false}
                remediationsEnabled={false}
                policies={policies}
              />
            )}
          </StateViewPart>
        </StateViewWithError>
      </Main>
    </React.Fragment>
  );
};

export default ComplianceSystems;
