/* eslint-disable react/display-name */
import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { nowrap } from '@patternfly/react-table';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import Main from '@redhat-cloud-services/frontend-components/Main';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';

const QUERY = gql`
  {
    profiles(search: "external = false and canonical = false") {
      edges {
        node {
          id
          name
          refId
          osMajorVersion
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
        <PageHeaderTitle title="Compliance systems" />
      </PageHeader>
      <Main>
        <StateViewWithError stateValues={{ error, data, loading }}>
          <StateViewPart stateKey="data">
            {policies && (
              <SystemsTable
                columns={[
                  Columns.customName({
                    showLink: true,
                  }),
                  Columns.inventoryColumn('tags'),
                  Columns.OS,
                  Columns.Policies,
                  Columns.inventoryColumn('updated', {
                    props: { isStatic: true },
                    transforms: [nowrap],
                  }),
                ]}
                defaultFilter={DEFAULT_FILTER}
                systemProps={{
                  isFullView: true,
                }}
                showOsMinorVersionFilter={policies.map(
                  (policy) => policy.osMajorVersion
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
