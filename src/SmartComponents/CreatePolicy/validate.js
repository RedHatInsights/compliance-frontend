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

export const validateRulesPage = (selectedRuleRefIds) => {
    if (!selectedRuleRefIds) {
        return false;
    } else {
        return true;
    }
};
