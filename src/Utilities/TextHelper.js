export const isNumberRange = (value) => value && !!value.match(/\d\d*-\d\d*/);

export const fixedPercentage = (value, fixed = 0, withPercent = true) => {
  const fixedValue = parseFloat(value)?.toFixed(fixed);
  return fixedValue + (withPercent ? '%' : '');
};

export const stringToId = (string) => string.replace(' ', '').toLowerCase();
