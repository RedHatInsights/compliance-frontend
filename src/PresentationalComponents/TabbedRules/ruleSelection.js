// Rule selection utilities

export const matchesSelectionItem = (selectionItem, profile) => (
    selectionItem.id === profile.id
);

export const selectedRuleRefIdsForTab = (selectedRuleRefIds, profile) => {
    const tabSelection = (selectedRuleRefIds || []).find((selectionItem) =>
        matchesSelectionItem(selectionItem, profile)
    );
    return tabSelection?.ruleRefIds || [];
};

export const profilesWithRulesToSelection = (profiles, prevSelection = [], options = {}) => {
    const { only } = options;
    const additionalSelection = profiles.map((profile) => {
        const foundSelection = prevSelection.find((selectionItem) =>
            matchesSelectionItem(selectionItem, profile)
        );
        if (!foundSelection) {
            if (!profile.rules) {
                console.error(`Profile ${profile.id} is missing rules for selection!`);
            }

            return {
                id: profile.id,
                ruleRefIds: profile.rules?.map((rule) => (rule.refId)) || []
            };
        } else if (only) {
            return foundSelection;
        }
    }).filter((v) => !!v);

    return only ? additionalSelection : [...prevSelection, ...additionalSelection];
};

export const tabsDataToOsMinorMap = (tabsData) => {
    const osMinorMap = {};
    tabsData.forEach(({ profile, newOsMinorVersion }) => {
        if (profile?.id) {
            const osMinorVersion = newOsMinorVersion || profile.osMinorVersion;
            osMinorMap[profile.id] = [
                ...(osMinorMap[profile.id] || []),
                osMinorVersion
            ];
        }
    });
    return osMinorMap;
};

export const extendProfilesByOsMinor = (profiles, osMinorMap) => (
    profiles.flatMap((profile) => (
        (osMinorMap[profile.id] || [undefined]).map((osMinorVersion) => (
            { ...profile, osMinorVersion }
        ))
    ))
);
