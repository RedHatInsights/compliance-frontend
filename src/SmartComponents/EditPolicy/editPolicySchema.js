import { componentTypes } from '@data-driven-forms/react-form-renderer';

const rulesTab = (ruleFieldProps) => ({
  name: 'rules',
  title: 'Rules',
  fields: [
    {
      component: 'edit-policy-rules-field',
      name: 'rules-content',
      fieldProps: ruleFieldProps,
    },
  ],
});

const systemsTab = (systemFieldProps) => ({
  name: 'systems',
  title: 'Systems',
  fields: [
    {
      component: 'edit-policy-systems-field',
      name: 'systems-content',
      fieldProps: systemFieldProps,
    },
  ],
});

export default (ruleFieldProps, systemFieldProps = {}) => ({
  fields: [
    {
      component: componentTypes.TABS,
      name: 'edit-policy-tabs',
      fields: [rulesTab(ruleFieldProps), systemsTab(systemFieldProps)],
    },
  ],
});
