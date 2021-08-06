export const profilesRulesFailed = (profiles) =>
  profiles.flatMap(
    (profile) =>
      profile.rules && profile.rules.filter((rule) => !rule.compliant)
  );

export const profilesRulesPassed = (profiles) =>
  profiles.flatMap(
    (profile) => profile.rules && profile.rules.filter((rule) => rule.compliant)
  );

export const systemRulesPassed = (system) =>
  system.testResultProfiles
    ? profilesRulesPassed(system.testResultProfiles)
    : [];

export const systemRulesFailed = (system) =>
  system.testResultProfiles
    ? profilesRulesFailed(system.testResultProfiles)
    : [];

export const systemSupportedByProfiles = (profiles = []) =>
  profiles.reduce((acc, profile) => acc && !!profile.supported, true);

export const systemsWithRuleObjectsFailed = (systems) =>
  systems.map((system) => ({
    ...system,
    ruleObjectsFailed: systemRulesFailed(system),
    supported: systemSupportedByProfiles(system.testResultProfiles),
    profiles: system.testResultProfiles,
  }));

export const toRulesArrayWithProfile = (profilesWithRules) =>
  profilesWithRules.flatMap((profileWithRules) =>
    profileWithRules.rules.map((rule) => {
      const identifier = rule.identifier && JSON.parse(rule.identifier);
      return {
        ...rule,
        references: rule.references ? JSON.parse(rule.references) : [],
        identifier: identifier && identifier.label ? identifier : null,
        profile: profileWithRules.profile,
      };
    })
  );
