import sortBy from 'lodash/sortBy';

const formatRule = (rule) => ({
  id: `ssg:rhel${rule.profile.osMajorVersion}|${
    rule.profile.refId.split('xccdf_org.ssgproject.content_profile_')[1]
  }|${rule.refId}`,
  description: rule.title,
  systems: rule.systems,
});

const sortByPrecedence = (issues) => sortBy(issues, ['precedence']);

const isRemediatable = ({ compliant, remediationAvailable }) =>
  compliant === false && remediationAvailable;

const getSupportedSystems = (systems = []) =>
  systems.filter(({ testResultProfiles }) =>
    testResultProfiles.some(({ supported }) => supported)
  );

const getSystemIssues = (system) =>
  Array.from(
    new Set(
      system.testResultProfiles.flatMap((profile) =>
        profile.rules.filter(isRemediatable).map((rule) => ({
          ...rule,
          profile,
        }))
      )
    )
  );

const appendSystemsIssues = (selectedRules) => (issues, system) => {
  const systemIssues = getSystemIssues(system);

  for (const rule of systemIssues) {
    const ruleDetails = {
      ...rule,
      ...issues[rule.refId],
      systems: Array.from(
        new Set([...(issues[rule.refId]?.systems || []), system.id])
      ),
    };

    if (selectedRules?.length > 0) {
      if (selectedRules.map(({ refId }) => refId).includes(rule.refId)) {
        issues[rule.refId] = ruleDetails;
      }
    } else {
      issues[rule.refId] = ruleDetails;
    }
  }

  return issues;
};

const getIssuesWithSystems = (systems, selectedRules) =>
  Object.values(systems.reduce(appendSystemsIssues(selectedRules), []));

export const provideData = ({ systems, selectedRules } = {}) => {
  const supportedSystems = getSupportedSystems(systems);
  const issues = sortByPrecedence(
    getIssuesWithSystems(supportedSystems, selectedRules)
  ).map(formatRule);

  return {
    ...(issues.length > 0 ? { issues } : {}),
  };
};

export const remediationData = (results) => {
  if (results) {
    return provideData({
      systems: results.reduce((acc, { edges }) => {
        return [...acc, ...edges.map(({ node }) => node)];
      }, []),
    });
  }
};
