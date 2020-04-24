export const profilesRulesFailed = (profiles) => (
    profiles.map(profile => profile.rules.filter(rule => !rule.compliant)).flat()
);

export const profilesRulesPassed = (profiles) => (
    profiles.map(profile => profile.rules.filter(rule => rule.compliant)).flat()
);

export const systemRulesPassed = (system) => (
    profilesRulesPassed(system.profiles)
);

export const systemRulesFailed = (system) => (
    profilesRulesFailed(system.profiles)
);

export const systemsWithRuleObjectsFailed = (systems) => (
    systems.map(system => (
        { ruleObjectsFailed: systemRulesFailed(system), ...system }
    ))
);
