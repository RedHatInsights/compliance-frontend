import React from 'react';
import propTypes from 'prop-types';
import { TabbedRules } from 'PresentationalComponents';
import { countOsMinorVersions } from 'Store/Reducers/SystemStore';

const EditPolicyRulesTab = ({ handleSelect, policy, selectedRuleRefIds }) => {
    let tabsData = [];
    const osMinorVersionCounts = policy?.hosts && countOsMinorVersions(policy.hosts);
    const profiles = policy?.policy?.profiles;

    if (osMinorVersionCounts && profiles) {
        tabsData = osMinorVersionCounts.map(({ osMinorVersion, count: systemCount }) => {
            osMinorVersion = `${osMinorVersion}`;
            let profileSelectedRuleRefIds;
            const profile = profiles.find((profile) => profile.osMinorVersion === osMinorVersion);
            if (profile) {
                profileSelectedRuleRefIds = selectedRuleRefIds?.find(({ id }) => id === profile.id);
            }

            return {
                profile,
                systemCount,
                newOsMinorVersion: osMinorVersion,
                selectedRuleRefIds: profileSelectedRuleRefIds?.ruleRefIds
            };
        });
    }

    tabsData = tabsData.filter(({ profile }) => !!profile);

    return <TabbedRules
        tabsData={ tabsData }
        remediationsEnabled={ false }
        selectedFilter
        level={ 1 }
        handleSelect={ handleSelect } />;
};

EditPolicyRulesTab.propTypes = {
    handleSelect: propTypes.func,
    policy: propTypes.object,
    selectedRuleRefIds: propTypes.array
};

export default EditPolicyRulesTab;
