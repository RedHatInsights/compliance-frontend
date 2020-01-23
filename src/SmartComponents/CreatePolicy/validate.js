export const validateFirstPage = (benchmark, profile) => {
    if (!benchmark || !profile) {
        return false;
    } else {
        return true;
    }
};

export const validateSecondPage = (name, refId) => {
    if (!name || !refId) {
        return false;
    } else {
        return true;
    }
};
