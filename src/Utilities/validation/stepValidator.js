export const makeStepValidityValidator = (message) => (value) =>
  value?.isValid === true ? undefined : message;
