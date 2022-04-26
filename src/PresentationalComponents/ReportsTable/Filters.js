import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const policyNameFilter = [
  {
    type: conditionalFilterType.text,
    label: 'Policy name',
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
    filter: (profiles, values) =>
      profiles.filter(({ osMajorVersion }) => values.includes(osMajorVersion)),
    items: operatingSystems.map((operatingSystem) => ({
      label: `RHEL ${operatingSystem}`,
      value: operatingSystem,
    })),
  },
];

export const policyComplianceFilter = [
  {
    type: conditionalFilterType.checkbox,
    label: 'Systems meeting compliance',
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
