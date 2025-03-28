import React from 'react';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import CalendarFilter from './CalendarFilter';

export const stringToId = (string) =>
  string.split(/\s+/).join('-').toLowerCase();

export const policyNameFilter = [
  {
    type: conditionalFilterType.text,
    label: 'Policy name',
    filterAttribute: 'title',
  },
];

export const calendarFilterType = {
  // Creates the filterValues prop for the filterConfig passed to the toolbar/table provided the current value/state
  filterValues: ({ Component }, handler, value) => ({
    value,
    children: <Component onChange={handler} value={value} />,
  }),
  // Returns (all/a) filter chip for a given filter active value(s)
  filterChips: (configItem, value) => ({
    category: configItem.label,
    chips: [{ name: value.toLocaleString() }],
  }),
  // Returns "select" arguments for the selection manager from a selected value
  // The returning of selectedValue/selectedValues is inconsistent.
  toSelectValue: (configItem, value, values) => [
    value || values,
    stringToId(configItem.label),
    true,
  ],
  // Returns "deselect" arguments from a filter chip
  toDeselectValue: (configItem) => [
    undefined,
    stringToId(configItem.label),
    true,
  ],
};

export const operatingSystemFilter = (operatingSystems) => [
  {
    type: conditionalFilterType.checkbox,
    label: 'Operating system',
    filterAttribute: 'os_major_version',
    items: operatingSystems.map((operatingSystem) => ({
      label: `RHEL ${operatingSystem}`,
      value: `${operatingSystem}`,
    })),
  },
  {
    type: 'calendar',
    label: 'Calendar Filter',
    filterAttribute: 'calendar',
    Component: CalendarFilter,
  },
];

export const policyComplianceFilter = [
  {
    type: conditionalFilterType.checkbox,
    label: 'Systems meeting compliance',
    filterAttribute: 'percent_compliant',
    filterSerialiser: (_, values) =>
      `(${values
        .map((value) => {
          const scoreRange = value.split('-');
          return `(percent_compliant >= ${scoreRange[0]} AND percent_compliant <= ${scoreRange[1]})`;
        })
        .join(' OR ')})`,
    items: [
      { label: '90 - 100%', value: '90-100' },
      { label: '70 - 89%', value: '70-89' },
      { label: '50 - 69%', value: '50-69' },
      { label: 'Less than 50%', value: '0-49' },
    ],
  },
];
