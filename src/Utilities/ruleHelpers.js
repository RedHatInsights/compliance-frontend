export const profilesRulesFailed = (profiles) => (
    profiles.map(profile => profile.rules.filter(rule => !rule.compliant)).flat()
);

export const profilesRulesPassed = (profiles) => (
    profiles.map(profile => profile.rules.filter(rule => rule.compliant)).flat()
);

export const systemRulesPassed = (system) => (
    system.profiles ? profilesRulesPassed(system.profiles) : []
);

export const systemRulesFailed = (system) => (
    system.profiles ? profilesRulesFailed(system.profiles) : []
);

export const systemsWithRuleObjectsFailed = (systems) => (
    systems.map(system => (
        { ruleObjectsFailed: systemRulesFailed(system), ...system }
    ))
);
