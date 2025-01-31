export const checkForNonDefaultValues = (values, valueDefinitions) =>
  Object.entries(values || {}).some(([valueId, value]) => {
    const valueDefinition = valueDefinitions.find(
      (valueDefinition) =>
        valueDefinition.refId === valueId || valueDefinition.id === valueId
    );

    return value !== valueDefinition?.defaultValue;
  });

const validators = {
  number: (value) => {
    return /^\d*$/.test(value);
  },
};

export const validatorFor = (valueDefinition) =>
  validators[valueDefinition?.type] || (() => true);

export const disableEdit = (value) => /(\n|\r|\\n|\\r)/.test(value);
