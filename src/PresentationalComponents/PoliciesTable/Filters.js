import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const nameFilter = {
  type: conditionalFilterType.text,
  label: 'Name',
  filterAttribute: 'title',
  filter: (policies, value) =>
    policies.filter((policy) =>
      policy.name.toLowerCase().includes(value.toLowerCase())
    ),
};
