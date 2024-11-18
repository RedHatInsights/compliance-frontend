import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const policyNameFilter = [
  {
    type: conditionalFilterType.text,
    label: 'Policy name',
    filterAttribute: 'title',
    filter: (profiles, value) => {
      const lowerCaseValue = value.toLowerCase();
      return profiles.filter((profile) =>
        [profile.name, profile.policy.name]
          .join()
          .toLowerCase()
          .includes(lowerCaseValue)
      );
    },
  },
];

export const policyTypeFilter = (policyTypes) => [
  {
    type: conditionalFilterType.checkbox,
    label: 'Policy type',
    // TODO profile_title needs to be added as scoped_search attribute for REST API
    // filterAttribute: 'profile_title',
    filter: (profiles, values) =>
      profiles.filter(({ policyType }) => values.includes(policyType)),
    items: policyTypes.map((policyType) => ({
      label: policyType,
      value: policyType,
    })),
  },
];

export const operatingSystemFilter = (operatingSystems) => [
  {
    type: conditionalFilterType.checkbox,
    label: 'Operating system',
    filterAttribute: 'os_major_version',
    filter: (profiles, values) =>
      profiles.filter(({ osMajorVersion }) => values.includes(osMajorVersion)),
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
      values
        .map((value) => {
          const scoreRange = value.split('-');
          return `(percent_compliant >= ${scoreRange[0]} AND percent_compliant <= ${scoreRange[1]})`;
        })
        .join(' OR '),
    filter: (profiles, values) =>
      profiles.filter(({ testResultHostCount, compliantHostCount }) => {
        const compliantHostsPercent = Math.round(
          (100 / testResultHostCount) * compliantHostCount
        );
        const matching = values
          .map((value) => {
            const [min, max] = value.split('-');
            return compliantHostsPercent >= min && compliantHostsPercent <= max;
          })
          .filter((i) => !!i);
        return matching.length > 0;
      }),
    items: [
      { label: '90 - 100%', value: '90-100' },
      { label: '70 - 89%', value: '70-89' },
      { label: '50 - 69%', value: '50-69' },
      { label: 'Less than 50%', value: '0-49' },
    ],
  },
];
