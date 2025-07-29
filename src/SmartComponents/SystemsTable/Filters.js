import React from 'react';
import { coerce, valid } from 'semver';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const name = {
  type: conditionalFilterType.text,
  label: 'Name',
  id: 'hostnameOrId',
  filterAttribute: 'display_name',
};

export const policies = (policies) => ({
  type: conditionalFilterType.checkbox,
  label: 'Policy',
  filterAttribute: 'policies',
  items: policies.map((policy) => ({
    label: policy.title,
    value: policy.id,
  })),
});

export const ssgVersions = (ssgVersions) => ({
  type: conditionalFilterType.checkbox,
  label: 'SSG Version',
  filterAttribute: 'security_guide_version',
  items: ssgVersions.map((ssgVersion) => ({
    label: ssgVersion,
    value: ssgVersion,
  })),
});

export const compliant = {
  type: conditionalFilterType.checkbox,
  label: 'Compliance',
  filterSerialiser: (_filterConfig, values) =>
    values
      .map((value) => {
        if (value === 'compliant' || value === 'non-compliant') {
          return `(compliant = ${value === 'compliant'})`;
        }

        if (value === 'not-supported') {
          return '(supported = false)';
        }
      })
      .join(' OR '),
  items: [
    {
      label: 'Compliant',
      value: 'compliant',
    },
    {
      label: 'Non-compliant',
      value: 'non-compliant',
    },
    { label: 'Not supported', value: 'not-supported' },
  ],
};

export const complianceScore = {
  type: conditionalFilterType.checkbox,
  label: 'Compliance score',
  filterSerialiser: (_filterConfig, values) =>
    values
      .map((value) => {
        const scoreRange = value.split('-');
        return `(score >= ${scoreRange[0]} and score < ${scoreRange[1]})`;
      })
      .join(' OR '),
  items: [
    { label: '90 - 100%', value: '90-101' },
    { label: '70 - 89%', value: '70-90' },
    { label: '50 - 69%', value: '50-70' },
    { label: 'Less than 50%', value: '0-50' },
  ],
};

// TODO These should be in some component folder
const HighSeverity = () => (
  <>
    <ExclamationCircleIcon className="ins-u-failed" /> High
  </>
);

const MediumSeverity = () => (
  <>
    <ExclamationTriangleIcon className="ins-u-warning" /> Medium
  </>
);

const LowSeverityIcon = () => (
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

const LowSeverity = () => (
  <>
    <LowSeverityIcon /> Low
  </>
);

const UnknownSeverity = () => (
  <>
    <QuestionCircleIcon /> Unknown
  </>
);

export const severity = {
  type: conditionalFilterType.checkbox,
  label: 'Failed rule severity',
  filterAttribute: 'failed_rule_severity',
  items: [
    { label: <HighSeverity />, value: 'high' },
    { label: <MediumSeverity />, value: 'medium' },
    { label: <LowSeverity />, value: 'low' },
    { label: <UnknownSeverity />, value: 'unknown' },
  ],
};

export const os = (ignoreOsMajorVersion) => ({
  id: 'osFilter',
  filterSerialiser: (_filterConfig, osFilter) => {
    if (osFilter !== undefined) {
      const versionList = [];
      const filterName = ignoreOsMajorVersion
        ? 'os_minor_version'
        : 'os_version';
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
  },
});

export const group = {
  id: 'hostGroupFilter',
  filterSerialiser: (_filterConfig, hostGroupFilter) => {
    if (
      hostGroupFilter !== undefined &&
      Array.isArray(hostGroupFilter) &&
      hostGroupFilter.length > 0
    ) {
      return `(${hostGroupFilter
        .map((value) => `group_name = "${value}"`)
        .join(' or ')})`;
    }
  },
};

export const tags = {
  id: 'tagsFilters',
  filterSerialiser: (_filterConfig, tagsFilters) =>
    (tagsFilters || []).flatMap((tagFilter) =>
      tagFilter.values.map(
        (tag) =>
          `${encodeURIComponent(tagFilter.key)}/${encodeURIComponent(
            tag.tagKey,
          )}=${encodeURIComponent(tag.value)}`,
      ),
    ),
};
