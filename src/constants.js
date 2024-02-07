/* eslint max-len: 0 */
import packageJson from './../package.json';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { dispatchNotification } from 'Utilities/Dispatcher';
import sortBy from 'lodash/sortBy';
import { cloneDeep } from 'lodash';

export const APP_ID = 'compliance';
export const DEFAULT_TITLE = 'Compliance | Red Hat Insights';
export const DEFAULT_TITLE_SUFFIX = ` - ${DEFAULT_TITLE}`;

export const COMPLIANCE_API_ROOT = '/api/compliance';
export const COMPLIANCE_UI_ROOT = '/rhel/compliance';
export const INVENTORY_API_ROOT = '/api/inventory/v1';

export const API_HEADERS = {
  'X-Insights-Compliance': packageJson.version,
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const supportedConfigsLink =
  'https://access.redhat.com/articles/6644131';

import React from 'react';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';

export const REMEDIATIONS_COLUMN = 4;
export const COMPLIANT_COLUMN = 3;
export const SEVERITY_COLUMN = 2;
export const POLICY_COLUMN = 1;
export const TITLE_COLUMN = 0;

const LowSeverityIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 18 18"
    role="img"
    style={{ verticalAlign: '-0.125em' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 0h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm6.67 10.46a1.67 1.67 0 1 0 0 3.338 1.67 1.67 0 0 0 0-3.338zm-1.586-6l.27 4.935a.435.435 0 0 0 .434.411H9.55c.232 0 .422-.18.435-.411l.27-4.936A.435.435 0 0 0 9.818 4h-2.3c-.25 0-.448.21-.435.46z"
      fill="#3A9CA6"
      fillRule="evenodd"
    />
  </svg>
);

export const HIGH_SEVERITY = (
  <React.Fragment>
    <ExclamationCircleIcon className="ins-u-failed" /> High
  </React.Fragment>
);
export const MEDIUM_SEVERITY = (
  <React.Fragment>
    <ExclamationTriangleIcon className="ins-u-warning" /> Medium
  </React.Fragment>
);
export const LOW_SEVERITY = (
  <React.Fragment>{LowSeverityIcon} Low</React.Fragment>
);
export const UNKNOWN_SEVERITY = (
  <React.Fragment>
    <QuestionCircleIcon /> Unknown
  </React.Fragment>
);

export const SEVERITY_LEVELS = ['high', 'medium', 'low', 'unknown'];

export const DEFAULT_SYSTEMS_FILTER_CONFIGURATION = [
  {
    type: conditionalFilterType.text,
    label: 'Name',
    filterString: (value) => `name ~ ${value}`,
  },
];

export const systemsPolicyFilterConfiguration = (policies) => [
  {
    type: conditionalFilterType.checkbox,
    label: 'Policy',
    filterString: (value) => `policy_id = ${value}`,
    items: policies.map((policy) => ({
      label: policy.name,
      value: policy.id,
    })),
  },
];

const osMajorVersionsFromProfiles = (policies) =>
  Array.from(new Set(policies.map((profile) => profile.osMajorVersion)));

export const systemsOsFilterConfiguration = (policies) => [
  {
    type: conditionalFilterType.checkbox,
    label: 'Operating system',
    filterString: (value) => `os_major_version = ${value}`,
    items: osMajorVersionsFromProfiles(policies).map((osVersion) => ({
      label: `RHEL ${osVersion}`,
      value: osVersion,
    })),
  },
];

const toSystemsOsMinorFilterConfigurationItem =
  (osVersions) => (majorVersion) => ({
    label: `RHEL ${majorVersion}`,
    value: majorVersion,
    groupSelectable: true,
    items: sortBy(osVersions[majorVersion])
      .reverse()
      .map((minorVersion) => ({
        label: `RHEL ${majorVersion}.${minorVersion}`,
        value: `${majorVersion}.${minorVersion}`,
      })),
  });

const emptyFilterDropDownItem = {
  value: '',
  isDisabled: true,
  items: [
    {
      value: '',
      label: (
        <div className="ins-c-osfilter__no-os">No OS versions available</div>
      ),
      isDisabled: true,
      items: [],
      className: 'ins-c-osfilter__os-filter-button',
    },
  ],
};

/**
 * @typedef {Object.<string, boolean>} SelectedMinorVersions
 * @typedef {Object.<string, MinorVersions>} SelectedVersions
 * @typedef {Number} MinorVersion
 * @typedef {MinorVersion[]} OsVersion
 */

/**
 * Handles transforming `{ 7: { 7.3: true, 7.5: true } }` to `{7: {3: true, 5: true}}` with handling case in which only major version is selected
 * @param {SelectedVersions} selectedVersions
 * @param {OsVersion[]} osMajorVersions
 * @returns {SelectedVersions}
 */
const transformVersionObject = (selectedVersions, osMajorVersions) => {
  console.log('selectedVersions', selectedVersions);
  return Object.entries(selectedVersions).reduce((acc, entry) => {
    const [majorVersion, minorVersions] = entry;
    console.log('osMajorVersions', osMajorVersions); // osMajorVersions []

    if (
      Object.keys(minorVersions).includes(majorVersion) &&
      minorVersions[majorVersion]
    ) {
      // if (selectedVersions has shape {8: {8: true }}) -> means major version was selected and all minor version from osMajorVersions need to be included
      // acc[majorVersion] = osMajorVersions
      //   .filter((v) => v['major'] === Number(majorVersion))
      //   .reduce((acc, o) => {
      //     acc[`${o.minor}`] = true;
      //     return acc;
      //   }, {});

      // console.log('majorVersion', majorVersion);
      // console.log('osMajorVersions[majorVersion]', osMajorVersions[majorVersion]);
      acc[majorVersion] = osMajorVersions[majorVersion].reduce((acc, minor) => {
        acc[`${minor}`] = true;
        return acc;
      }, {});

      return acc;
    } else {
      acc[majorVersion] = Object.entries(minorVersions).reduce(
        (acc, [minorVersion, toInclude]) => {
          acc[minorVersion.split('.')[1]] = toInclude;
          return acc;
        },
        {}
      );
      return acc;
    }
  }, {});
}

export const systemsOsMinorFilterConfiguration = (osMajorVersions) => {
  console.log('osMajorVersions', osMajorVersions); // osMajorVersions [empty 7x, [5, 7, 8, 9], [6, 7, 8, 9]]
  const osMajors = cloneDeep(osMajorVersions);

  const filterString = function (selectedVersions) {

    console.log('osMajors', osMajors); // []

    const versionObject = transformVersionObject(selectedVersions, osMajors);

    console.log('versionObject', versionObject);

    return [
      Object.entries(versionObject)
        .flatMap(([majorVersion, minorVersions]) =>
          Object.entries(minorVersions).map(
            ([minorVersion, toInclude]) =>
              toInclude &&
              `( os_major_version = ${majorVersion} AND os_minor_version = ${minorVersion} )`
          )
        )
        .filter((v) => !!v)
        .join(' OR '),
    ];
  };
  const osVersions = sortBy(Object.keys(osMajorVersions).map(Number)).reverse();

  const items =
    osVersions.length > 0
      ? osVersions.map(toSystemsOsMinorFilterConfigurationItem(osMajorVersions))
      : [emptyFilterDropDownItem];

  return [
    {
      type: conditionalFilterType.group,
      label: 'Operating system',
      filterString,
      items,
    },
  ];
};

export const COMPLIANT_SYSTEMS_FILTER_CONFIGURATION = [
  {
    type: conditionalFilterType.checkbox,
    label: 'Compliance',
    filterString: (value) => `${value}`,
    items: [
      {
        label: 'Compliant',
        value: 'compliant = true AND supported_ssg = true',
      },
      {
        label: 'Non-compliant',
        value: 'compliant = false AND supported_ssg = true',
      },
      { label: 'Not supported', value: 'supported_ssg = false' },
      { label: 'Never reported', value: 'reported = false' },
    ],
  },
  {
    type: conditionalFilterType.checkbox,
    label: 'Compliance score',
    filterString: (value) => {
      const scoreRange = value.split('-');
      return `(compliance_score >= ${scoreRange[0]} and compliance_score < ${scoreRange[1]})`;
    },
    items: [
      { label: '90 - 100%', value: '90-101' },
      { label: '70 - 89%', value: '70-90' },
      { label: '50 - 69%', value: '50-70' },
      { label: 'Less than 50%', value: '0-50' },
    ],
  },
];

export const COMPLIANCE_REPORT_TABLE_ADDITIONAL_FILTER = [
  {
    type: conditionalFilterType.checkbox,
    label: 'Failed rule severity',
    filterString: (value) => `failed_rules_with_severity ^ (${value})`,
    items: [
      { label: HIGH_SEVERITY, value: 'high' },
      { label: MEDIUM_SEVERITY, value: 'medium' },
      { label: LOW_SEVERITY, value: 'low' },
      { label: UNKNOWN_SEVERITY, value: 'unknown' },
    ],
  },
];

export const COMPLIANCE_TABLE_DEFAULTS = {
  exportable: {
    onStart: () => {
      dispatchNotification({
        variant: 'info',
        title: 'Preparing export',
        description: 'Once complete, your download will start automatically.',
      });
    },
    onComplete: () => {
      dispatchNotification({
        variant: 'success',
        title: 'Downloading export',
      });
    },
  },
  manageColumns: true,
};

export const paletteColors = {
  black300: '#D2D2D2', // '--pf-global--palette--black-300',
  black200: '#F0F0F0', // --pf-global--palette--black-200,
  blue200: '#73BCF7', // '--pf-global--palette--blue-200',
  blue300: '#2B9AF3', //'--pf-global--palette--blue-300',
  blue400: '#0066CC', //'--pf-global--palette--blue-400',
  gold300: '#F4C145', //--pf-global--palette--gold-300',
};

export const backgroundColors = {
  light300: '#f0f0f0', //'--pf-global--BackgroundColor--light-300',
};
