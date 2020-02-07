export const fixedPercentage = (value, fixed = 0, withPercent = true) => {
    return (value).toFixed(fixed) + (withPercent ? '%' : '');
};

export const pluralize = (value, singular, plural) => {
    if (!plural) {
        plural = singular + 's';
    }

    return (value > 1 || value === 0 ? plural : singular);
};

export const lastScanned = (dates) => {
    const last = new Date(Math.max.apply(null, dates.filter((date) => isFinite(date))));
    const result = (last instanceof Date && isFinite(last)) ? last : 'Never';

    return result;
};
