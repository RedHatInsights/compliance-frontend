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
    profileWithRules.rules.map(({ identifier, references, ...rule }) => {
      const valueDefinitions = profileWithRules.valueDefinitions?.filter(
        ({ id }) => {
          return rule.values?.includes(id);
        }
      );

      const ruleValues = Object.fromEntries(
        Object.entries(
          profileWithRules.ruleValues?.[profileWithRules.id] ||
            profileWithRules.ruleValues?.[profileWithRules.profile.id] ||
            {}
        ).filter(
          ([valueId]) =>
            valueDefinitions.map(({ refId }) => refId).includes(valueId) ||
            valueDefinitions.map(({ id }) => id).includes(valueId)
        )
      );

      return {
        ...rule,
        references: references ? references : [],
        identifier: identifier && identifier.label ? identifier : null,
        profile: profileWithRules.profile,
        policyId: profileWithRules.id,
        valueDefinitions,
        ruleValues,
      };
    })
  );

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
