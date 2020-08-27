export const validateFirstPage = (benchmark, profile) => {
    if (!benchmark || !profile) {
        return false;
    } else {
        return true;
    }
};

export const thresholdValid = (threshold) => (
    threshold < 101 && threshold >= 0
);

export const validateSecondPage = (name, refId, complianceThreshold) => (
    !name || !refId  || !complianceThreshold || !thresholdValid(complianceThreshold) ? false : true
);

export const validateThirdPage = (selectedRuleRefIds) => {
    if (!selectedRuleRefIds) {
        return false;
    } else {
        return true;
    }
};
