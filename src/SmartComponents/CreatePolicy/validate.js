export const validateSecurityGuidePage = (osMajorVersion, profile) => {
  if (osMajorVersion && profile) {
    return true;
  } else {
    return false;
  }
};

export const hasMaxDecimals = (num, dec) =>
  new RegExp(`^[-]?\\d+(\\.\\d{1${dec > 1 ? ',' + dec : ''}})?$`, 'g').test(
    num.toString(),
  );

export const thresholdValid = (threshold) => {
  const parsedThreshold = parseFloat(threshold);
  return (
    parsedThreshold <= 100 &&
    parsedThreshold >= 0 &&
    hasMaxDecimals(parsedThreshold, 1)
  );
};

export const validateDetailsPage = (
  name,
  refId,
  complianceThreshold,
  formHasAsyncErrors,
) =>
  !formHasAsyncErrors ||
  !name ||
  !refId ||
  !complianceThreshold ||
  !thresholdValid(complianceThreshold)
    ? false
    : true;

export const validateRulesPage = (selectedRuleRefIds) =>
  selectedRuleRefIds?.length > 0;

export const validateSystemsPage = (systemIds, allowNoSystems) => {
  if (allowNoSystems) {
    return true;
  } else {
    return systemIds?.length > 0;
  }
};
