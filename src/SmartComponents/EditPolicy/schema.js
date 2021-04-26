import EditPolicyRulesField from './EditPolicyRulesField';
import EditPolicySystemsField from './EditPolicySystemsField';

export const componentMapper = {
    rules: EditPolicyRulesField,
    systems: EditPolicySystemsField
};

const detailsTab = (policy) =>({
    validateFields: [],
    name: '1',
    title: 'Details',
    description: '',
    fields: [{
        name: 'description',
        label: 'Policy description',
        component: 'textarea',
        value: policy.description,
        validate: []
    }, {
        name: 'businessObjective',
        label: 'Business objective',
        component: 'text-field',
        validate: []
    }, {
        name: 'businessObjective',
        label: 'Compliance threshold (%)',
        component: 'text-field',
        validate: []
    }]
});

const rulesTab = (initialRuleSelection, props) => ({
    validateFields: [],
    name: '2',
    title: 'Rules',
    description: '',
    fields: [{
        name: 'rules',
        component: 'rules',
        initialValue: initialRuleSelection,
        FieldProps: props,
        dataType: 'string',
        validate: []
    }]
});

const systemsTab = (initialSystemsSeletion, { osMajorVersion }) => ({
    validateFields: [],
    name: '2',
    title: 'Systems',
    description: '',
    fields: [{
        name: 'systems',
        component: 'systems',
        initialValue: initialSystemsSeletion,
        FieldProps: {
            osMajorVersion
        },
        dataType: 'string',
        validate: []
    }]
});

export default (
    policy, {
        initialRuleSelection, initialSystemsSeletion, ruleFieldProps
    }
) => ({
    fields: [{
        component: 'tabs',
        name: 'tabs',
        fields: [
            detailsTab(policy),
            rulesTab(initialRuleSelection, ruleFieldProps),
            systemsTab(initialSystemsSeletion, policy)
        ]
    }]
});
