import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

const rule = {
  type: conditionalFilterType.text,
  label: 'Rule',
  filterSerialiser: (_, value) =>
    `(title ~ "${value}" OR identifier_label ~ "${value}")`,
};

export default [rule];
