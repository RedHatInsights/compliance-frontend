import { orderByArray } from 'Utilities/helpers';
import { SEVERITY_LEVELS } from '@/constants';

const scannedProfiles = (profiles) =>
  profiles.filter((profile) => profile.lastScanned != 'Never');

const isSystemCompliant = (system) => {
  const hasScannedProfiles =
    scannedProfiles(system.testResultProfiles).length > 0;
  const hasOnlyCompliantScannedProfiles = scannedProfiles(
    system.testResultProfiles
  ).every((profile) => profile.compliant);

  return hasScannedProfiles && hasOnlyCompliantScannedProfiles;
};

const isSystemNonCompliant = (system) => {
  const hasScannedProfiles =
    scannedProfiles(system.testResultProfiles).length > 0;
  const hasNonCompliantProfiles =
    scannedProfiles(system.testResultProfiles).filter(
      (profile) => !profile.compliant
    ).length > 0;

  return hasScannedProfiles && hasNonCompliantProfiles;
};

const hasProfiles = ({ testResultProfiles }) =>
  scannedProfiles(testResultProfiles).length > 0;

const isSystemSupported = (system) =>
  hasProfiles(system) &&
  scannedProfiles(system.testResultProfiles).every(
    (profile) => profile.supported
  );

const isSystemUnsupported = (system) =>
  hasProfiles(system) &&
  scannedProfiles(system.testResultProfiles).every(
    (profile) => !profile.supported
  );

export const compliantSystemsData = (systems) =>
  systems.filter(
    (system) => isSystemSupported(system) && isSystemCompliant(system)
  );

export const nonCompliantSystemsData = (systems) =>
  systems.filter(
    (system) => isSystemSupported(system) && isSystemNonCompliant(system)
  );

export const unsupportedSystemsData = (systems) =>
  systems.filter((system) => isSystemUnsupported(system));

const topTenFromRulesWithCounts = (failedRulesWithCounts) => {
  const failedRulesWithCountsArray = Object.values(failedRulesWithCounts);

  const topTenByCount = failedRulesWithCountsArray
    .sort((ruleWithCount) => ruleWithCount.systemCount)
    .slice(0, 10);

  const topTenIsSingleCount =
    topTenByCount.filter((ruleWithCount) => ruleWithCount.systemCount === 1)
      .length === 10;

  const topTenBySeverity = topTenIsSingleCount
    ? orderByArray(
        failedRulesWithCountsArray,
        'severity',
        SEVERITY_LEVELS,
        'asc'
      ).slice(0, 10)
    : undefined;

  return topTenBySeverity ? topTenBySeverity : topTenByCount;
};

const getFailedRulesWithCounts = (systems) => {
  const failedRulesWithCounts = {};
  const countIfFailed = (rule) => {
    if (!rule.compliant) {
      const failedRuleCount = failedRulesWithCounts[rule.refId];
      if (failedRuleCount) {
        failedRulesWithCounts[rule.refId]['systemCount']++;
      } else {
        failedRulesWithCounts[rule.refId] = {
          systemCount: 1,
          ...rule,
        };
      }
    }
  };

  nonCompliantSystemsData(systems).forEach((system) => {
    system.testResultProfiles.forEach((profile) => {
      profile.rules.forEach((rule) => countIfFailed(rule));
    });
  });

  return failedRulesWithCounts;
};

export const topTenFailedRulesData = (systems) =>
  topTenFromRulesWithCounts(getFailedRulesWithCounts(systems));
