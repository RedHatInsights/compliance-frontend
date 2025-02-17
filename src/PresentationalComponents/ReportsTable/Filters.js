import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const policyNameFilter = [
  {
    type: conditionalFilterType.text,
    label: 'Policy name',
    filterAttribute: 'title',
  },
];

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
