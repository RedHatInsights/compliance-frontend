import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';

export const policyNameFilter = [{
    type: conditionalFilterType.text,
    label: 'Policy name',
    filter: (profiles, value) => {
        const lowerCaseValue = value.toLowerCase();
        return profiles.filter((profile) => (
            [
                profile.name,
                (profile?.policy?.name || '')
            ].join().toLowerCase().includes(lowerCaseValue)
        ));
    }
}];

export const policyTypeFilter = (policies) => ([{
    type: conditionalFilterType.checkbox,
    label: 'Policy type',
    filter: (profiles, values) => (
        profiles.filter(({ policy }) => values.includes(policy?.id))
    ),
    items: policies.map((policy) => ({
        label: policy.name,
        value: policy.id
    }))
}]);

export const operatingSystemFilter = (operatingSystems) => ([{
    type: conditionalFilterType.checkbox,
    label: 'Operating system',
    filter: (profiles, values) => (
        profiles.filter(({ majorOsVersion }) => (
            values.includes(majorOsVersion)
        ))
    ),
    items: operatingSystems.map((operatingSystem) => ({
        label: `RHEL ${operatingSystem}`,
        value: operatingSystem
    }))
}]);

export const policyComplianceFilter = [{
    type: conditionalFilterType.checkbox,
    label: 'Systemsmeetingcompliance', // FIX in FC: The filterconfig helper can't handle two much space...
    filter: (profiles, values) => (
        profiles.filter(({ totalHostCount, compliantHostCount }) => {
            const compliantHostsPercent = Math.round((100 / totalHostCount) * compliantHostCount);
            const matching = values.map((value) => {
                const [min, max] = value.split('-');
                return compliantHostsPercent >= min && compliantHostsPercent <= max;
            }).filter((i) => (!!i));
            return matching.length > 0;
        })
    ),
    items: [
        { label: '90 - 100%', value: '90-100' },
        { label: '70 - 89%', value: '70-89' },
        { label: '50 - 69%', value: '50-69' },
        { label: 'Less than 50%', value: '0-49' }
    ]
}];
