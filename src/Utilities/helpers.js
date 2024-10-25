import React from 'react';
import natsort from 'natsort';
import { gql } from '@apollo/client';

export const uniq = (collection) => [...new Set(collection)];

export const sortingByProp =
  (propName, order = 'asc') =>
  (objA, objB) => {
    const descending = order != 'asc';
    const propA = (objA && objA[propName]) || '';
    const propB = (objB && objB[propName]) || '';

    const sorter = natsort({ desc: descending });
    return sorter(propA, propB);
  };

// eslint-disable-next-line react/display-name
export const renderComponent = (Component, props) => (_data, _id, entity) =>
  <Component {...entity} {...props} />;

const getSortable = (property, item) => {
  if (typeof property === 'function') {
    return property(item);
  } else {
    return item[property];
  }
};

export const stringToId = (string) => string.split(' ').join('').toLowerCase();

export const orderArrayByProp = (property, objects, direction) =>
  objects.sort((a, b) => {
    if (direction === 'asc') {
      return String(getSortable(property, a)).localeCompare(
        String(getSortable(property, b))
      );
    } else {
      return -String(getSortable(property, a)).localeCompare(
        String(getSortable(property, b))
      );
    }
  });

export const orderByArray = (objectArray, orderProp, orderArray, direction) => {
  const sortedObjectArray = orderArray.flatMap((orderKey) =>
    objectArray.filter((item) => item[orderProp] === orderKey)
  );
  return direction !== 'asc' ? sortedObjectArray.reverse() : sortedObjectArray;
};

export const getProperty = (obj, path, fallback) => {
  const parts = path.split('.');
  const key = parts.shift();
  if (typeof obj[key] !== 'undefined') {
    return parts.length > 0
      ? getProperty(obj[key], parts.join('.'), fallback)
      : obj[key];
  }

  return fallback;
};

export const camelCase = (string) =>
  string
    .split(/[-_\W]+/g)
    .map((string) => string.trim())
    .map((string) => string[0].toUpperCase() + string.substring(1))
    .join('');

export const constructQuery = (columns) => {
  const fragments = {};
  const columnKeys = columns?.map((column) => column.key);
  columnKeys?.forEach((key) => (fragments[key + 'Column'] = true));

  const query = gql`
    fragment NameColumn on System {
      name
      osMajorVersion
      osMinorVersion
    }

    fragment OsColumn on System {
      osMajorVersion
      osMinorVersion
    }

    fragment SsgVersionColumn on System {
      testResultProfiles(policyId: $policyId) {
        supported
        benchmark {
          version
        }
      }
    }

    fragment PoliciesColumn on System {
      policies(policyId: $policyId) {
        id
        name
      }
    }

    fragment FailedRulesColumn on System {
      testResultProfiles(policyId: $policyId) {
        rulesFailed
        supported
        osMajorVersion
        score
      }
    }

    fragment ComplianceScoreColumn on System {
      testResultProfiles(policyId: $policyId) {
        compliant
        supported
        score
      }
    }

    fragment LastScannedColumn on System {
      testResultProfiles(policyId: $policyId) {
        lastScanned
      }
    }

    fragment UpdatedColumn on System {
      updated
      culledTimestamp
      staleWarningTimestamp
      staleTimestamp
    }

    fragment TagsColumn on System {
      tags
    }

    fragment GroupsColumn on System {
      groups
    }

    query U_Systems(
      $filter: String!
      $policyId: ID
      $perPage: Int
      $page: Int
      $sortBy: [String!]
      $tags: [String!]
      $nameColumn: Boolean = false
      $operatingSystemColumn: Boolean = false
      $ssg_versionColumn: Boolean = false
      $policiesColumn: Boolean = false
      $failedRulesColumn: Boolean = false
      $complianceScoreColumn: Boolean = false
      $lastScannedColumn: Boolean = false
      $updatedColumn: Boolean = false
      $tagsColumn: Boolean = false
      $groupsColumn: Boolean = false
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
            testResultProfiles(policyId: $policyId) {
              id
            }
            ...NameColumn @include(if: $nameColumn)
            ...OsColumn @include(if: $operatingSystemColumn)
            ...SsgVersionColumn @include(if: $ssg_versionColumn)
            ...PoliciesColumn @include(if: $policiesColumn)
            ...FailedRulesColumn @include(if: $failedRulesColumn)
            ...ComplianceScoreColumn @include(if: $complianceScoreColumn)
            ...LastScannedColumn @include(if: $lastScannedColumn)
            ...UpdatedColumn @include(if: $updatedColumn)
            ...TagsColumn @include(if: $tagsColumn)
            ...GroupsColumn @include(if: $groupsColumn)
          }
        }
      }
    }
  `;

  return {
    query,
    fragments,
  };
};

export const logMultipleErrors = (...errors) => {
  for (const error of errors) {
    if (error) {
      console.error(error);
    }
  }

  return errors?.filter((v) => !!v).length > 0 || undefined;
};

export const buildOSObject = (osVersions = []) => {
  return osVersions
    .filter((version) => !!version && typeof version === 'string')
    .map((version) => {
      const [major, minor] = version.split('.');
      return {
        count: 0,
        value: {
          name: 'RHEL',
          major,
          minor,
        },
      };
    });
};
export const calculateOffset = (page, perPage) => (page - 1) * perPage;
