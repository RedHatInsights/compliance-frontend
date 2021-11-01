import { orderByArray } from 'Utilities/helpers';
import { SEVERITY_LEVELS } from '@/constants';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

// TODO move to utilities
// to make these helpers available elsewhere and then use where needed

const scannedProfiles = (profiles) =>
  profiles?.filter((profile) => profile.lastScanned != 'Never') || [];

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

export const supportedSystemsData = (systems) =>
  systems.filter((system) => isSystemSupported(system));

export const sortBySystemsCount = (rules) =>
  sortBy(rules, 'systemsCount').reverse();

const sortBySeverity = (rules, order = 'asc') =>
  orderByArray(rules, 'severity', SEVERITY_LEVELS, order);

export const topTenRulesSortedBySeverityAndSystemCount = (
  failedRulesWithCountsArray
) => {
  const topTenRulesBySeverity = sortBySeverity(
    failedRulesWithCountsArray,
    'asc'
  ).slice(0, 10);
  const rulesGroupedBySeverity = groupBy(topTenRulesBySeverity, 'severity');

  return SEVERITY_LEVELS.flatMap((rulesGroupKey) =>
    sortBySystemsCount(rulesGroupedBySeverity[rulesGroupKey] || [])
  );
};

// Returns the "top ten" failed rules by system count
// or just random "top 10" rules by severity
export const topTenFromRulesWithCounts = (failedRulesWithCounts) =>
  topTenRulesSortedBySeverityAndSystemCount(
    Object.values(failedRulesWithCounts)
  );

// Sums up rules and adds the number of systems failed for each
// TODO refactor.
const getFailedRulesWithCounts = (systems) => {
  const failedRulesWithCounts = {};
  const countIfFailed = (rule) => {
    if (!rule.compliant) {
      const failedRuleCount = failedRulesWithCounts[rule.refId];
      if (failedRuleCount) {
        failedRulesWithCounts[rule.refId]['systemsCount']++;
      } else {
        failedRulesWithCounts[rule.refId] = {
          systemsCount: 1,
          ...rule,
        };
      }
    }
  };

  supportedSystemsData(systems).forEach((system) => {
    system.testResultProfiles.forEach((profile) => {
      profile.rules.forEach((rule) => countIfFailed(rule));
    });
  });

  return failedRulesWithCounts;
};

export const topTenFailedRulesData = (systems) =>
  topTenFromRulesWithCounts(getFailedRulesWithCounts(systems));
