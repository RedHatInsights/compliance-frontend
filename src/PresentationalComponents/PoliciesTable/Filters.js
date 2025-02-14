import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

export const nameFilter = {
  type: conditionalFilterType.text,
  label: 'Name',
  filterAttribute: 'title',
};
