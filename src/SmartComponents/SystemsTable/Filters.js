import React from 'react';
import { coerce, valid } from 'semver';
import {
  HighSeverity,
  MediumSeverity,
  LowSeverity,
  UnknownSeverity,
} from '../../PresentationalComponents/RulesTable/components/SeverityIcons';
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
  label: 'Compliant status',
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
  id: 'tagFilters',
  filterSerialiser: (_filterConfig, tagFilters) =>
    (tagFilters || []).flatMap((tagFilter) =>
      tagFilter.values.map(
        (tag) =>
          `${encodeURIComponent(tagFilter.key)}/${encodeURIComponent(
            tag.tagKey,
          )}=${encodeURIComponent(tag.value)}`,
      ),
    ),
};
