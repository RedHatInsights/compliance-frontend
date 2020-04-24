export const profilesRulesFailed = (profiles) => (
    profiles.flatMap(profile => profile.rules && profile.rules.filter(rule => !rule.compliant))
);

export const profilesRulesPassed = (profiles) => (
    profiles.flatMap(profile => profile.rules && profile.rules.filter(rule => rule.compliant))
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
