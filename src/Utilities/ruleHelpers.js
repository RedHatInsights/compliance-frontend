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

export const systemSupportedByProfiles = (profiles = []) => (
    profiles.reduce((acc, profile) => acc && !!profile.supported, true)
);

export const systemsWithRuleObjectsFailed = (systems) => (
    systems.map(system => (
        {
            ...system,
            ruleObjectsFailed: systemRulesFailed(system),
            supported: systemSupportedByProfiles(system.testResultProfiles),
            profiles: system.testResultProfiles
        }
    ))
);
