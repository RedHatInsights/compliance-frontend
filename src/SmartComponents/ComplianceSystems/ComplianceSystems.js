/* eslint-disable react/display-name */
import React from 'react';
import propTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import { nowrap } from '@patternfly/react-table';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag';
import dataSerialiser from '@/Utilities/dataSerialiser';
import { apiInstance } from '@/Utilities/hooks/useQuery';
import { policiesDataMapper, systemsDataMapper } from '@/constants';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import GatedComponents from '@/PresentationalComponents/GatedComponents';
import { buildOSObject } from '../../Utilities/helpers';

export const QUERY = gql`
  {
    profiles(search: "external = false and canonical = false") {
      edges {
        node {
          id
          name
          osMajorVersion
        }
      }
    }
  }
`;

const DEFAULT_FILTER_GRAPHQL = 'has_test_results = true or has_policy = true';
const DEFAULT_FILTER_REST = 'assigned_or_scanned=true';

const processSystemsData = (data) =>
  dataSerialiser(
    data.map((entry) => ({
      ...entry,
      policies: dataSerialiser(entry.policies, policiesDataMapper),
    })),
    systemsDataMapper
  );

export const fetchApi = async (page, perPage, combinedVariables) =>
  apiInstance
    .systems(
      undefined,
      combinedVariables.tags,
      perPage,
      page,
      combinedVariables.idsOnly,
      combinedVariables.sortBy,
      combinedVariables.filter
    )
    .then(({ data: { data = [], meta = {} } = {} } = {}) => ({
      data: processSystemsData(data),
      meta,
    }));

const fetchCustomOSes = ({ filters }) =>
  apiInstance.systemsOS(null, filters).then(({ data }) => {
    return {
      results: buildOSObject(data),
      total: data?.length || 0,
    };
  });

const ComplianceSystemsBase = ({ error, data, loading, policies }) => {
  const apiV2Enabled = useAPIV2FeatureFlag();

  return (
    <React.Fragment>
      <PageHeader className="page-header">
        <PageHeaderTitle title="Systems" />
      </PageHeader>
      <section className="pf-v5-c-page__main-section">
        <StateViewWithError stateValues={{ error, data, loading }}>
          <StateViewPart stateKey="data">
            {policies && (
              <SystemsTable
                columns={[
                  Columns.customName(
                    {
                      showLink: true,
                    },
                    { sortBy: apiV2Enabled ? ['display_name'] : ['name'] }
                  ),
                  Columns.inventoryColumn('groups', {
                    requiresDefault: true,
                    sortBy: ['groups'],
                  }),
                  Columns.inventoryColumn('tags'),
                  Columns.OS(apiV2Enabled),
                  Columns.Policies,
                  Columns.inventoryColumn('updated', {
                    props: { isStatic: true },
                    transforms: [nowrap],
                  }),
                ]}
                defaultFilter={
                  apiV2Enabled ? DEFAULT_FILTER_REST : DEFAULT_FILTER_GRAPHQL
                }
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
                showGroupsFilter
                fetchApi={fetchApi}
                fetchCustomOSes={fetchCustomOSes}
                apiV2Enabled={apiV2Enabled}
              />
            )}
          </StateViewPart>
        </StateViewWithError>
      </section>
    </React.Fragment>
  );
};

ComplianceSystemsBase.propTypes = {
  data: propTypes.array.isRequired,
  error: propTypes.object,
  loading: propTypes.bool,
  policies: propTypes.array.isRequired,
};

const ComplianceSystemsGraphQL = () => {
  const { data, error, loading } = useQuery(QUERY);
  const policies = data?.profiles?.edges.map(({ node }) => node);

  return <ComplianceSystemsBase {...{ data, error, loading, policies }} />;
};

const ComplianceSystemsRest = () => {
  let { data: { data } = {}, error, loading } = usePolicies();

  if (data) {
    data = dataSerialiser(data, policiesDataMapper);
  }

  return (
    <ComplianceSystemsBase
      {...{ data, error, loading, policies: data || [] }}
    />
  );
};

export default () => (
  <GatedComponents
    RestComponent={ComplianceSystemsRest}
    GraphQLComponent={ComplianceSystemsGraphQL}
  />
);
