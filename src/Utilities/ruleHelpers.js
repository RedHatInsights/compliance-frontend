export const NEVER = 'Never';

export const profilesRulesFailed = (profiles) =>
  profiles.flatMap(
    (profile) =>
      profile.rules && profile.rules.filter((rule) => !rule.compliant)
  );

export const profilesRulesPassed = (profiles) =>
  profiles.flatMap(
    (profile) => profile.rules && profile.rules.filter((rule) => rule.compliant)
  );

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

export const complianceScoreData = (profiles) => {
  const scoreTotal = profiles.reduce((acc, profile) => acc + profile.score, 0);
  const rulesPassed = profilesRulesPassed(profiles).length;
  const rulesFailed = profilesRulesFailed(profiles).length;
  const numScored = profiles.reduce((acc, profile) => {
    if (
      profilesRulesPassed([profile]).length +
        profilesRulesFailed([profile]).length >
      0
    ) {
      return acc + 1;
    }

    return acc;
  }, 0);
  const score = numScored ? scoreTotal / numScored : 0;
  const compliant = profiles.every(
    (profile) => profile.lastScanned === NEVER || profile.compliant === true
  );

  return {
    score,
    rulesPassed,
    rulesFailed,
    compliant,
    supported: systemSupportedByProfiles(profiles),
  };
};
