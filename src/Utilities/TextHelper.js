export const fixedPercentage = (value, fixed = 0, withPercent = true) => {
    return (value).toFixed(fixed) + (withPercent ? '%' : '');
};
