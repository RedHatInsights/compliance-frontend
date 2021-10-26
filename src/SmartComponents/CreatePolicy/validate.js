export const validateBenchmarkPage = (benchmark, osMajorVersion, profile) => {
  if (benchmark && osMajorVersion && profile) {
    return true;
  } else {
    return false;
  }
};

export const hasMaxDecimals = (num, dec) =>
  new RegExp(`^[-]?\\d+(\\.\\d{1${dec > 1 ? ',' + dec : ''}})?$`, 'g').test(
    num.toString()
  );

export const thresholdValid = (threshold) => {
  const parsedThreshold = parseFloat(threshold);
  return (
    parsedThreshold <= 100 &&
    parsedThreshold >= 0 &&
    hasMaxDecimals(parsedThreshold, 1)
  );
};

export const validateDetailsPage = (name, refId, complianceThreshold) =>
  !name ||
  !refId ||
  !complianceThreshold ||
  !thresholdValid(complianceThreshold)
    ? false
    : true;

export const validateRulesPage = (selectedRuleRefIds) =>
  selectedRuleRefIds?.length > 0;

export const validateSystemsPage = (systemIds) => {
  if (systemIds) {
    return systemIds.length > 0;
  } else {
    return false;
  }
};
