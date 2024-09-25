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

export const nonReportingSystemsData = (systems) => {
  const reportingSystemIds = [
    ...compliantSystemsData(systems),
    ...nonCompliantSystemsData(systems),
    ...unsupportedSystemsData(systems),
  ].map((system) => system.id);

  return systems.filter((system) => !reportingSystemIds.includes(system.id));
};

const buildExportData = ({
  exportSettings,
  totalHostCount,
  topTenFailedRules,
  compliantSystems,
  nonCompliantSystems,
  unsupportedSystems,
  nonReportingSystems,
}) => ({
  totalHostCount,

  compliantSystemCount: compliantSystems.length,
  ...(exportSettings.compliantSystems && {
    compliantSystems: compliantSystems,
  }),

  nonCompliantSystemCount: nonCompliantSystems.length,
  ...(exportSettings.nonCompliantSystems && {
    nonCompliantSystems: nonCompliantSystems,
  }),

  unsupportedSystemCount: unsupportedSystems.length,
  ...(exportSettings.unsupportedSystems && {
    unsupportedSystems: unsupportedSystems,
  }),

  ...(exportSettings.topTenFailedRules && {
    topTenFailedRules,
  }),
  nonReportingSystemCount: nonReportingSystems.length,
  ...(exportSettings.nonReportingSystems && {
    nonReportingSystems: nonReportingSystems,
  }),
  ...(exportSettings.userNotes && { userNotes: exportSettings.userNotes }),
});

export const prepareForExportGraphQL = (
  exportSettings,
  systems,
  topTenFailedRules
) => {
  const compliantSystems = compliantSystemsData(systems);
  const nonCompliantSystems = nonCompliantSystemsData(systems);
  const unsupportedSystems = unsupportedSystemsData(systems);
  const nonReportingSystems = nonReportingSystemsData(systems);

  return buildExportData({
    exportSettings,
    totalHostCount: systems.length,
    systems,
    topTenFailedRules,
    compliantSystems,
    nonCompliantSystems,
    unsupportedSystems,
    nonReportingSystems,
  });
};

export const prepareForExportRest = (
  exportSettings,
  compliantSystems = [],
  nonCompliantSystems = [],
  unsupportedSystems = [],
  nonReportingSystems = [],
  topTenFailedRules = []
) => {
  const totalHostCount =
    compliantSystems.length +
    nonCompliantSystems.length +
    unsupportedSystems.length +
    nonReportingSystems.length;

  return buildExportData({
    exportSettings,
    totalHostCount,
    topTenFailedRules,
    compliantSystems,
    nonCompliantSystems,
    unsupportedSystems,
    nonReportingSystems,
  });
};
