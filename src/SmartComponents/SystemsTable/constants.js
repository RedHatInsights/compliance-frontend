import { gql } from '@apollo/client';
import pickBy from 'lodash/pickBy';
import {
  systemsPolicyFilterConfiguration,
  systemsOsFilterConfiguration,
  systemsOsMinorFilterConfiguration,
} from '@/constants';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { entitiesReducer } from 'Store/Reducers/SystemStore';

export const GET_MINIMAL_SYSTEMS = gql`
  query ST_Systems(
    $filter: String!
    $perPage: Int
    $page: Int
    $sortBy: [String!]
    $tags: [String!]
  ) {
    systems(
      search: $filter
      limit: $perPage
      offset: $page
      sortBy: $sortBy
      tags: $tags
    ) {
      totalCount
      edges {
        node {
          id
          name
          osMajorVersion
          osMinorVersion
          culledTimestamp
          staleWarningTimestamp
          staleTimestamp
          insightsId
          lastScanned
          updated
        }
      }
    }
  }
`;

export const GET_SYSTEMS_OSES = gql`
  query ST_SystemOS($filter: String!) {
    systems(search: $filter) {
      osVersions
    }
  }
`;

export const policyFilter = (policies, osFilter) => [
  ...systemsPolicyFilterConfiguration(policies),
  ...(osFilter ? systemsOsFilterConfiguration(policies) : []),
];

export const osMinorVersionFilter = (...args) =>
  systemsOsMinorFilterConfiguration(...args);

export const initFilterState = (filterConfig) =>
  pickBy(filterConfig.initialDefaultState(), (value) => !!value);

export const defaultOnLoad =
  (columns) =>
  ({ INVENTORY_ACTION_TYPES, mergeWithEntities }) =>
    getRegistry().register({
      ...mergeWithEntities(entitiesReducer(INVENTORY_ACTION_TYPES, columns)),
    });

export const ssgVersionFilter = (ssgVersions) => [
  {
    type: conditionalFilterType.checkbox,
    label: 'SSG Version',
    filterString: (value) => `ssg_version = ${value}`,
    items: ssgVersions.map((ssgVersion) => ({
      label: ssgVersion,
      value: ssgVersion,
    })),
  },
];
