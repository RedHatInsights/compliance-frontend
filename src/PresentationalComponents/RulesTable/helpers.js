export const itemIdentifier = (item) => `${item.profile?.id}|${item.refId}`;

export const checkForNonDefaultValues = (values, valueDefinitions) =>
  Object.entries(values || {}).some(([valueId, value]) => {
    const valueDefinition = valueDefinitions.find(
      (valueDefinition) =>
        valueDefinition.refId === valueId || valueDefinition.id === valueId,
    );

    return value !== valueDefinition?.defaultValue;
  });

const validators = {
  number: (value) => {
    return /^\d*$/.test(value);
  },
  boolean: (value) => {
    return ['true', 'false'].includes(value);
  },
  string: () => {
    return true;
  },
};

export const validatorFor = (valueDefinition) =>
  validators[valueDefinition?.value_type] || (() => true);

export const disableEdit = (value) => /(\n|\r|\\n|\\r)/.test(value);
