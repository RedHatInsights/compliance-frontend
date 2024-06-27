import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const nameFilter = {
  type: conditionalFilterType.text,
  label: 'Name',
  filter: (policies, value) =>
    policies.filter((policy) =>
      policy.title.toLowerCase().includes(value.toLowerCase())
    ),
};
