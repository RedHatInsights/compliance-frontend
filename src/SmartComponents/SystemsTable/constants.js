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

export const policyFilter = (policies, osFilter, filterKey) => [
  ...systemsPolicyFilterConfiguration(policies, filterKey),
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

export const SSG_VERSION_FILTER_KEY_GRAPHQL = 'ssg_version';
export const SSG_VERSION_FILTER_KEY_REST = 'security_guide_version';
export const ssgVersionFilter = (
  ssgVersions,
  filter_key = SSG_VERSION_FILTER_KEY_REST
) => [
  {
    type: conditionalFilterType.checkbox,
    label: 'SSG Version',
    filterString: (value) => `${filter_key} = ${value}`,
    items: ssgVersions.map((ssgVersion) => ({
      label: ssgVersion,
      value: ssgVersion,
    })),
  },
];

export const mergedColumns = (columns) => (defaultColumns) =>
  columns.reduce((prev, column) => {
    const isStringCol = typeof column === 'string';
    const key = isStringCol ? column : column.key;
    const defaultColumn = defaultColumns.find(
      (defaultCol) => defaultCol.key === key
    );

    if (defaultColumn === undefined && column?.requiresDefault === true) {
      return prev; // exclude if not found in inventory
    } else {
      return [
        ...prev,
        {
          ...defaultColumn,
          ...(isStringCol ? { key: column } : column),
          props: {
            ...defaultColumn?.props,
            ...column?.props,
          },
        },
      ];
    }
  }, []);
