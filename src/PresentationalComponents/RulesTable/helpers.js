export const itemIdentifier = (item) => `${item.profile?.id}|${item.refId}`;

export const checkForNonDefaultValues = (values, valueDefinitions) =>
  Object.entries(values || {}).some(([valueId, value]) => {
    const valueDefinition = valueDefinitions.find(
      (valueDefinition) =>
        valueDefinition.refId === valueId || valueDefinition.id === valueId,
    );

    return value !== valueDefinition?.default_value;
  });

const validators = {
  number: (value) => {
    const valid = /^\d*$/.test(value);
    return {
      valid,
      errorMessage: valid ? null : 'Value must be a number',
    };
  },
  boolean: (value) => {
    const valid = ['true', 'false'].includes(value);
    return {
      valid,
      errorMessage: valid ? null : 'Value must be either "true" or "false"',
    };
  },
  string: () => {
    return {
      valid: true,
      errorMessage: null,
    };
  },
};

const defaultValidator = () => ({ valid: true, errorMessage: null });

export const validatorFor = (valueDefinition) => {
  return validators[valueDefinition?.value_type] || defaultValidator;
};

export const disableEdit = (value) => /(\n|\r|\\n|\\r)/.test(value);
