import flatten from 'lodash/flatten';

export const profilesRulesFailed = (profiles) => (
    flatten(profiles.map(profile => profile.rules.filter(rule => !rule.compliant)))
);

export const profilesRulesPassed = (profiles) => (
    flatten(profiles.map(profile => profile.rules.filter(rule => rule.compliant)))
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
