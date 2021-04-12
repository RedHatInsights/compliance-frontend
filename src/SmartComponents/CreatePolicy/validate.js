export const validateBenchmarkPage = (benchmark, osMajorVersion, profile) => {
    if (benchmark && osMajorVersion && profile) {
        return true;
    } else {
        return false;
    }
};

export const thresholdValid = (threshold) => (
    threshold < 101 && threshold >= 0
);

export const validateDetailsPage = (name, refId, complianceThreshold) => (
    !name || !refId  || !complianceThreshold || !thresholdValid(complianceThreshold) ? false : true
);

export const validateRulesPage = (selectedRuleRefIds) => (
    selectedRuleRefIds?.length > 0
);

export const validateSystemsPage = (systemIds) => {
    if (systemIds) {
        return systemIds.length > 0;
    } else {
        return false;
    }
};
