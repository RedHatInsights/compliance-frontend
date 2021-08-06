export const isNumberRange = (value) => value && !!value.match(/\d\d*-\d\d*/);

export const fixedPercentage = (value, fixed = 0, withPercent = true) => {
  const fixedValue = value?.toFixed(fixed);
  return fixedValue ? fixedValue + (withPercent ? '%' : '') : 'N/A';
};

export const pluralize = (value, singular, plural) => {
  if (!plural) {
    plural = singular + 's';
  }

  return value > 1 || value === 0 ? plural : singular;
};

export const stringToId = (string) => string.replace(' ', '').toLowerCase();
