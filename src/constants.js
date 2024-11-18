/* eslint max-len: 0 */
import packageJson from './../package.json';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { dispatchNotification } from 'Utilities/Dispatcher';
import sortBy from 'lodash/sortBy';

export const APP_ID = 'compliance';
export const DEFAULT_TITLE = 'Compliance';

export const COMPLIANCE_API_ROOT = '/api/compliance';
export const COMPLIANCE_UI_ROOT = '/rhel/compliance';
export const INVENTORY_API_ROOT = '/api/inventory/v1';

export const API_HEADERS = {
  'X-Insights-Compliance': packageJson.version,
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// Add a localStorage entry with the key "insights:compliance:asynctables" and value "true" to enable async tables
export const ENABLE_ASYNC_TABLE_HOOKS = localStorage
  ? localStorage.getItem('insights:compliance:asynctables') === 'true'
  : false;

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

export const DEFAULT_SYSTEMS_FILTER_CONFIGURATION_GRAPHQL = 'name';
export const DEFAULT_SYSTEMS_FILTER_CONFIGURATION_REST = 'display_name';

export const defaultSystemsFilterConfiguration = (
  filterKey = DEFAULT_SYSTEMS_FILTER_CONFIGURATION_REST
) => [
  {
    type: conditionalFilterType.text,
    label: 'Name',
    filterString: (value) => `${filterKey} ~ "${value}"`,
  },
];

export const POLICY_FILTER_KEY_GRAPHQL = 'policy_id';
export const POLICY_FILTER_KEY_REST = 'policies';

export const systemsPolicyFilterConfiguration = (
  policies,
  filterKey = POLICY_FILTER_KEY_REST
) => [
  {
    type: conditionalFilterType.checkbox,
    label: 'Policy',
    filterString: (value) => `${filterKey} = ${value}`,
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
        value: minorVersion,
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

export const systemsOsMinorFilterConfiguration = (osMajorVersions) => {
  const filterString = (value) => [
    Object.keys(value)
      .flatMap((majorVersion) =>
        Object.keys(value[majorVersion]).map(
          (minorVersion) =>
            value[majorVersion][minorVersion] &&
            `(os_major_version = ${majorVersion} AND os_minor_version = ${minorVersion})`
        )
      )
      .filter((v) => !!v)
      .join(' OR '),
  ];
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

export const COMPLIANT_SYSTEM_FILTER_CONFIG_KEYS_GRAPHQL = {
  compliant: 'compliant',
  supported: 'supported_ssg',
  neverReported: 'reported',
  complianceScore: 'compliance_score',
};

export const COMPLIANT_SYSTEM_FILTER_CONFIG_KEYS_REST = {
  compliant: 'compliant',
  supported: 'supported',
  neverReported: 'never_reported',
  complianceScore: 'score',
};

export const compliantSystemFilterConfiguration = (
  filterKeys = COMPLIANT_SYSTEM_FILTER_CONFIG_KEYS_REST
) => [
  {
    type: conditionalFilterType.checkbox,
    label: 'Compliance',
    filterString: (value) => `${value}`,
    items: [
      {
        label: 'Compliant',
        value: `${filterKeys.compliant} = true AND ${filterKeys.supported} = true`,
      },
      {
        label: 'Non-compliant',
        value: `${filterKeys.compliant} = false AND ${filterKeys.supported} = true`,
      },
      { label: 'Not supported', value: `${filterKeys.supported} = false` },
      {
        label: 'Never reported',
        value: `${filterKeys.neverReported} = false`,
      },
    ],
  },
  {
    type: conditionalFilterType.checkbox,
    label: 'Compliance score',
    filterString: (value) => {
      const scoreRange = value.split('-');
      return `(${filterKeys.complianceScore} >= ${scoreRange[0]} and ${filterKeys.complianceScore} < ${scoreRange[1]})`;
    },
    items: [
      { label: '90 - 100%', value: '90-101' },
      { label: '70 - 89%', value: '70-90' },
      { label: '50 - 69%', value: '50-70' },
      { label: 'Less than 50%', value: '0-50' },
    ],
  },
];

export const compliantSystemFilterRestConfiguration = (
  filterKeys = COMPLIANT_SYSTEM_FILTER_CONFIG_KEYS_REST
) => [
  {
    type: conditionalFilterType.checkbox,
    label: 'Compliance',
    filterString: (value) => `${value}`,
    items: [
      {
        label: 'Compliant',
        value: `(${filterKeys.compliant} = true)`,
      },
      {
        label: 'Non-compliant',
        value: `(${filterKeys.compliant} = false)`,
      },
      { label: 'Not supported', value: `(${filterKeys.supported} = false)` },
    ],
  },
  {
    type: conditionalFilterType.checkbox,
    label: 'Compliance score',
    filterString: (value) => {
      const scoreRange = value.split('-');
      return `(${filterKeys.complianceScore} >= ${scoreRange[0]} and ${filterKeys.complianceScore} < ${scoreRange[1]})`;
    },
    items: [
      { label: '90 - 100%', value: '90-101' },
      { label: '70 - 89%', value: '70-90' },
      { label: '50 - 69%', value: '50-70' },
      { label: 'Less than 50%', value: '0-50' },
    ],
  },
];

export const FAILED_RULE_SEVERITY_FITLER_KEY_GRAPHQL =
  'failed_rules_with_severity';

export const FAILED_RULE_SEVERITY_FITLER_KEY_REST = 'failed_rule_severity';

export const complianceReportTableAdditionalFilter = (
  filterKey = FAILED_RULE_SEVERITY_FITLER_KEY_REST
) => [
  {
    type: conditionalFilterType.checkbox,
    label: 'Failed rule severity',
    filterString: (value) => `${filterKey} ^ (${value})`,
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

export const systemsDataMapper = {
  display_name: 'name',
  culled_timestamp: 'culled_timestamp',
  os_major_version: 'osMajorVersion',
  os_minor_version: 'osMinorVersion',
  stale_timestamp: 'stale_timestamp',
  stale_warning_timestamp: 'stale_warning_timestamp',
  policies: 'policies',
  groups: 'groups',
  id: 'id',
  insights_id: 'insightsId',
  tags: 'tags',
  updated: 'updated',
};

export const testResultsDataMapper = {
  display_name: 'name',
  os_major_version: 'osMajorVersion',
  os_minor_version: 'osMinorVersion',
  groups: 'groups',
  id: 'id',
  insights_id: 'insightsId',
  tags: 'tags',
  updated: 'updated',
  score: ['complianceScore', 'score'],
  failed_rule_count: 'rulesFailed',
  security_guide_version: 'version',
  supported: 'supported',
  end_time: 'lastScanned',
  system_id: 'system_id',
  compliant: 'compliant',
};

export const policiesDataMapper = {
  title: 'name',
  id: 'id',
};

export const reportDataMap = {
  id: 'id',
  title: 'policy.name;name',
  business_objective: 'businessObjective',
  compliance_threshold: 'complianceThreshold',
  os_major_version: 'osMajorVersion',
  profile_title: 'policyType', // REST api does not return policyType. Thus, re-using profile_title
  ref_id: 'refId',
  assigned_system_count: 'totalHostCount',
  reported_system_count: 'testResultHostCount',
  compliant_system_count: 'compliantHostCount',
  unsupported_system_count: 'unsupportedHostCount',
  description: 'description',
  all_systems_exposed: 'all_systems_exposed',
  percent_compliant: 'percent_compliant',
};
