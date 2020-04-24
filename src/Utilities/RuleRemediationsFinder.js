export const profileRulesFailed = (profile) => (
    profile.rules.filter(rule => !rule.compliant)
);

export const profileRulesPassed = (profile) => (
    profile.rules.filter(rule => rule.compliant)
);

export const systemRulesPassed = (system) => (
    system.profiles.map(profile => profileRulesPassed(profile)).flat()
);

export const systemRulesFailed = (system) => (
    system.profiles.map(profile => profileRulesFailed(profile)).flat()
);

export const systemsWithRuleObjectsFailed = (systems) => (
    systems.map(system => (
        { ruleObjectsFailed: systemRulesFailed(system), ...system }
    ))
);
