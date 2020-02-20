import {
    conditionalFilterType
} from '@redhat-cloud-services/frontend-components';

export const defaultFilterConfig = (
    updateSearchFilter,
    updateCompliancFilter,
    { complianceScores, complianceStates },
    search
) => ({
    hideLabel: true,
    items: [
        {
            type: conditionalFilterType.text,
            label: 'Name or reference',
            filterValues: {
                onSubmit: updateSearchFilter,
                value: search
            }
        },
        {
            type: 'checkbox',
            label: 'Compliant',
            id: 'compliant',
            filterValues: {
                onChange: updateCompliancFilter,
                value: complianceStates,
                items: [
                    { label: 'Compliant', value: 'true' },
                    { label: 'Non-compliant', value: 'false' }
                ]
            }
        },
        {
            type: 'checkbox',
            label: 'Compliance score',
            id: 'complianceScore',
            filterValues: {
                onChange: updateCompliancFilter,
                value: complianceScores,
                items: [
                    { label: '90 - 100%', value: '90-100' },
                    { label: '70 - 89%', value: '70-89' },
                    { label: '50 - 69%', value: '50-69' },
                    { label: 'Less than 50%', value: '0-49' }
                ]
            }
        }
    ]
});

const noOpDefaultConfig = defaultFilterConfig(
    ()=>({}),
    ()=>({}),
    { complianceScores: {}, complianceStates: {} },
    ''
);

export const labelForValue = (value, category) => {
    try {
        return noOpDefaultConfig.items.filter((item) => (item.label === category))[0]
        .filterValues.items.filter((item) => (item.value === value))[0].label;
    }
    catch (_) {
        // eslint-disable-next-line no-console
        console.info('No label found for ' + value + ' in ' + category);
        return value;
    }
};
