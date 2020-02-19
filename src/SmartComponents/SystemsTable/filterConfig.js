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
                    { label: 'Compliant', value: 'compliant' },
                    { label: 'Non-compliant', value: 'noncompliant' }
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
