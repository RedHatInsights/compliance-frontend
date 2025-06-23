/* eslint max-len: 0 */

import React from 'react';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  QuestionCircleIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';
import { Icon } from '@patternfly/react-core';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import sortBy from 'lodash/sortBy';
import packageJson from './../package.json';

export const APP_ID = 'compliance';
export const DEFAULT_TITLE = 'Compliance';

// TODO this will be obsolete with the api_v1 removal
export const COMPLIANCE_API_ROOT = '/api/compliance';
export const COMPLIANCE_UI_ROOT = '/rhel/compliance';
export const INVENTORY_API_ROOT = '/api/inventory/v1';
export const API_BASE_URL = '/api/compliance/v2';
import {
  chart_color_black_100,
  chart_color_black_200,
  chart_color_yellow_300,
  chart_color_blue_100,
  chart_color_blue_300,
} from '@patternfly/react-tokens';

export const API_HEADERS = {
  'X-Insights-Compliance': packageJson.version,
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const supportedConfigsLink =
  'https://access.redhat.com/articles/6644131';

export const REMEDIATIONS_COLUMN = 4;
export const COMPLIANT_COLUMN = 3;
export const SEVERITY_COLUMN = 2;
export const POLICY_COLUMN = 1;
export const TITLE_COLUMN = 0;

export const HIGH_SEVERITY = (
  <React.Fragment>
    <Icon status="danger">
      <ExclamationCircleIcon />
    </Icon>{' '}
    High
  </React.Fragment>
);
export const MEDIUM_SEVERITY = (
  <React.Fragment>
    <Icon status="warning">
      <ExclamationTriangleIcon />
    </Icon>{' '}
    Medium
  </React.Fragment>
);
export const LOW_SEVERITY = (
  <React.Fragment>
    <Icon status="info">
      <InfoCircleIcon />
    </Icon>{' '}
    Low
  </React.Fragment>
);
export const UNKNOWN_SEVERITY = (
  <React.Fragment>
    <Icon>
      <QuestionCircleIcon />
    </Icon>{' '}
    Unknown
  </React.Fragment>
);

export const SEVERITY_LEVELS = ['high', 'medium', 'low', 'unknown'];

export const DEFAULT_SYSTEMS_FILTER_CONFIGURATION = 'display_name';

export const defaultSystemsFilterConfiguration = (
  filterKey = DEFAULT_SYSTEMS_FILTER_CONFIGURATION,
) => [
  {
    type: conditionalFilterType.text,
    label: 'Name',
    filterString: (value) => `${filterKey} ~ "${value}"`,
  },
];

export const POLICY_FILTER_KEY = 'policies';

export const systemsPolicyFilterConfiguration = (
  policies,
  filterKey = POLICY_FILTER_KEY,
) => [
  {
    type: conditionalFilterType.checkbox,
    label: 'Policy',
    filterString: (value) => `${filterKey} = ${value}`,
    items: policies.map((policy) => ({
      label: policy.title,
      value: policy.id,
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
    `(${Object.keys(value)
      .flatMap((majorVersion) =>
        Object.keys(value[majorVersion]).map(
          (minorVersion) =>
            value[majorVersion][minorVersion] &&
            `(os_major_version = ${majorVersion} AND os_minor_version = ${minorVersion})`,
        ),
      )
      .filter((v) => !!v)
      .join(' OR ')})`,
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

export const COMPLIANT_SYSTEM_FILTER_CONFIG_KEYS = {
  compliant: 'compliant',
  supported: 'supported',
  neverReported: 'never_reported',
  complianceScore: 'score',
};

export const compliantSystemFilterConfiguration = (
  filterKeys = COMPLIANT_SYSTEM_FILTER_CONFIG_KEYS,
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

export const FAILED_RULE_SEVERITY_FITLER_KEY = 'failed_rule_severity';

export const complianceReportTableAdditionalFilter = (
  filterKey = FAILED_RULE_SEVERITY_FITLER_KEY,
) => [
  {
    type: conditionalFilterType.checkbox,
    label: 'Failed rule severity',
    filterString: (value) => `${filterKey} = ${value}`,
    items: [
      { label: HIGH_SEVERITY, value: 'high' },
      { label: MEDIUM_SEVERITY, value: 'medium' },
      { label: LOW_SEVERITY, value: 'low' },
      { label: UNKNOWN_SEVERITY, value: 'unknown' },
    ],
  },
];

export const paletteColors = {
  black100: chart_color_black_100.value,
  black200: chart_color_black_200.value,
  blue100: chart_color_blue_100.value,
  blue300: chart_color_blue_300.value,
  gold300: chart_color_yellow_300.value,
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

export const unsupportedSystemWarningMessage =
  'This system was using an incompatible version of the SSG at the time this report was generated. ' +
  'Assessment of rules failed/passed on this system is a best-guess effort and may not be accurate.';
