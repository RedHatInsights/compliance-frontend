export const profilesRulesFailed = (profiles) => (
    profiles.flatMap(profile => profile.rules && profile.rules.filter(rule => !rule.compliant))
);

export const profilesRulesPassed = (profiles) => (
    profiles.flatMap(profile => profile.rules && profile.rules.filter(rule => rule.compliant))
);

export const systemRulesPassed = (system) => (
    system.testResultProfiles ? profilesRulesPassed(system.testResultProfiles) : []
);

export const systemRulesFailed = (system) => (
    system.testResultProfiles ? profilesRulesFailed(system.testResultProfiles) : []
);

export const systemsWithRuleObjectsFailed = (systems) => (
    systems.map(system => (
        {
            ...system,
            ruleObjectsFailed: systemRulesFailed(system),
            profiles: system.testResultProfiles
        }
    ))
);
