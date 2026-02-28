import { componentMapper } from '@data-driven-forms/pf4-component-mapper';
import EditPolicyRulesField from './EditPolicyRulesField';
import EditPolicySystemsField from './EditPolicySystemsField';

const editPolicyComponentMapper = {
  ...componentMapper,
  'edit-policy-rules-field': EditPolicyRulesField,
  'edit-policy-systems-field': EditPolicySystemsField,
};

export default editPolicyComponentMapper;
