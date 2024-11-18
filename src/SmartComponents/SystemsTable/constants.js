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
import isPlainObject from 'lodash/isPlainObject';
import { coerce, valid } from 'semver';

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

export const groupFilterHandler = ({ hostGroupFilter }) => {
  if (
    hostGroupFilter !== undefined &&
    Array.isArray(hostGroupFilter) &&
    hostGroupFilter.length > 0
  ) {
    return `(${hostGroupFilter
      .map((value) => `group_name = "${value}"`)
      .join(' or ')})`;
  }
};

export const osFilterHandler = ({ osFilter }, ignoreOsMajorVersion) => {
  if (osFilter !== undefined && isPlainObject(osFilter)) {
    const filterString = [];
    Object.entries(osFilter).forEach(([, osVersionGroups]) => {
      const selectedOsVersions = Object.entries(osVersionGroups);
      selectedOsVersions.shift(); //first entry contains only major version, thus ignored

      selectedOsVersions.forEach(([version, isSelected]) => {
        const parsedSemverVersion = coerce(version.split('-').pop() || null);

        if (valid(parsedSemverVersion) && isSelected) {
          filterString.push(
            !ignoreOsMajorVersion
              ? `(os_major_version=${parsedSemverVersion.major} AND os_minor_version=${parsedSemverVersion.minor})`
              : `os_minor_version=${parsedSemverVersion.minor}`
          );
        }
      });
    });

    return filterString.join(' OR ');
  }
};

export const nameFilterHandler = ({ hostnameOrId }) =>
  hostnameOrId && `display_name ~ "${hostnameOrId}"`;

export const applyInventoryFilters = (
  handlers,
  invFilters,
  ...handlerArguments
) => {
  return handlers.reduce((resultingFilter, handler) => {
    const currentFilter = handler(invFilters, ...handlerArguments);
    if (currentFilter) {
      return resultingFilter
        ? `${resultingFilter} AND ${currentFilter}`
        : currentFilter;
    }

    return resultingFilter;
  }, null);
};
