import React from 'react';
import {
  HighSeverity,
  MediumSeverity,
  LowSeverity,
  UnknownSeverity,
} from './components/SeverityIcons';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

const filterRulesWithAllValues = (rules, values, valueCheck) =>
  rules.filter(
    (rule) =>
      values.map((value) => valueCheck(rule, value)).filter((v) => !!v).length >
      0
  );

const anyFilterApply = (rules, values, valueCheck) => {
  let filteredRules = [];
  rules.forEach((rule) => {
    if (
      values.map((value) => valueCheck(rule, value)).filter((v) => !!v).length >
      0
    ) {
      filteredRules.push(rule);
    }
  });
  return filteredRules;
};

const BASE_FILTER_CONFIGURATION = [
  {
    type: conditionalFilterType.text,
    label: 'Name',
    filterAttribute: 'title',
  },
  {
    type: conditionalFilterType.checkbox,
    label: 'Severity',
    filterAttribute: 'severity',
    items: [
      { label: <HighSeverity />, value: 'high' },
      { label: <MediumSeverity />, value: 'medium' },
      { label: <LowSeverity />, value: 'low' },
      { label: <UnknownSeverity />, value: 'unknown' },
    ],
  },
];

const RULE_STATE_REST_SERIALISER = {
  passed: 'pass',
  failed: 'fail',
};

const RULE_STATE_FILTER_CONFIG = {
  type: conditionalFilterType.checkbox,
  label: 'Rule state',
  items: [
    { label: 'Passed rules', value: 'passed' },
    { label: 'Failed rules', value: 'failed' },
  ],
  filterSerialiser: (_filterConfig, values) =>
    `(${values
      .map((value) => `result = ${RULE_STATE_REST_SERIALISER[value]}`)
      .join(' OR ')})`,
  filter: (rules, values) =>
    anyFilterApply(
      rules,
      values,
      (rule, value) => rule.compliant === (value === 'passed')
    ),
};

export const policiesFilterConfig = (policies) => ({
  type: conditionalFilterType.checkbox,
  label: 'Policy',
  items: policies.map((policy) => ({ label: policy.name, value: policy.id })),
  filter: (rules, values) =>
    filterRulesWithAllValues(
      rules,
      values,
      (rule, value) => rule.profile.id === value
    ),
});

export const ANSIBLE_SUPPORT_FILTER_CONFIG = {
  type: conditionalFilterType.checkbox,
  label: 'Ansible support',
  items: [
    { label: 'Ansible remediation support', value: 'true' },
    { label: 'No Ansible remediation support', value: 'false' },
  ],
  filterSerialiser: (_filterConfig, values) =>
    `(${values
      .map((value) => `remediation_available = ${value}`)
      .join(' OR ')})`,
};

const buildFilterConfig = ({
  showRuleStateFilter,
  policies,
  ansibleSupportFilter,
}) => {
  const config = [...BASE_FILTER_CONFIGURATION];

  if (showRuleStateFilter) {
    config.push(RULE_STATE_FILTER_CONFIG);
  }

  if (policies && policies.length > 1) {
    config.push(policiesFilterConfig(policies));
  }

  if (ansibleSupportFilter) {
    config.push(ANSIBLE_SUPPORT_FILTER_CONFIG);
  }

  return config;
};

export default buildFilterConfig;
