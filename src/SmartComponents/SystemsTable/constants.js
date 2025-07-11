import pickBy from 'lodash/pickBy';
import {
  systemsPolicyFilterConfiguration,
  systemsOsMinorFilterConfiguration,
} from '@/constants';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { entitiesReducer } from 'Store/Reducers/SystemStore';
import isPlainObject from 'lodash/isPlainObject';
import { coerce, valid } from 'semver';
import { apiInstance } from '@/Utilities/hooks/useQuery';
import { buildOSObject } from '@/Utilities/helpers';
import { policiesDataMapper, systemsDataMapper } from '@/constants';
import dataSerialiser from '@/Utilities/dataSerialiser';

export const policyFilter = (policies, filterKey) => [
  ...systemsPolicyFilterConfiguration(policies, filterKey),
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

export const SSG_VERSION_FILTER_KEY = 'security_guide_version';
export const ssgVersionFilter = (
  ssgVersions,
  filter_key = SSG_VERSION_FILTER_KEY,
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
      (defaultCol) => defaultCol.key === key,
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
    const versionList = [];
    const filterName = ignoreOsMajorVersion ? 'os_minor_version' : 'os_version';
    Object.entries(osFilter).forEach(([, osVersionGroups]) => {
      const selectedOsVersions = Object.entries(osVersionGroups);
      selectedOsVersions.shift(); // first entry contains only major version, thus ignored

      selectedOsVersions.forEach(([version, isSelected]) => {
        const parsedSemverVersion = coerce(version.split('-').pop() || null);

        if (valid(parsedSemverVersion) && isSelected) {
          if (ignoreOsMajorVersion) {
            versionList.push(`${parsedSemverVersion.minor}`);
          } else {
            versionList.push(
              `${parsedSemverVersion.major}.${parsedSemverVersion.minor}`,
            );
          }
        }
      });
    });

    return versionList.length > 0
      ? `${filterName} ^ (${versionList.join(' ')})`
      : '';
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

const processSystemsData = (data) =>
  dataSerialiser(
    data.map((entry) => ({
      ...entry,
      policies: dataSerialiser(entry.policies, policiesDataMapper),
    })),
    systemsDataMapper,
  );

export const fetchSystemsApi = async (page, perPage, combinedVariables) =>
  apiInstance
    .systems(
      undefined,
      combinedVariables.tags,
      perPage,
      page,
      combinedVariables.idsOnly,
      combinedVariables.sortBy,
      combinedVariables.filter,
    )
    .then(({ data: { data = [], meta = {} } = {} } = {}) => ({
      data: processSystemsData(data),
      meta,
    }));

export const fetchCustomOSes = ({ filters }) =>
  apiInstance.systemsOS(null, filters).then(({ data }) => {
    return {
      results: buildOSObject(data),
      total: data?.length || 0,
    };
  });
