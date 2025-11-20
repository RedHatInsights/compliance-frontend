import { faker } from '@faker-js/faker';

const buildValueDefinitions = (length, itemIds = []) => {
  const count = itemIds.length > 0 ? itemIds.length : length;

  return [...Array(count)].map((_, index) => {
    const valueType = faker.helpers.arrayElement([
      'string',
      'number',
      'boolean',
    ]);
    let defaultValue;

    switch (valueType) {
      case 'number':
        defaultValue = faker.number.int({ min: 1, max: 100 }).toString();
        break;
      case 'boolean':
        defaultValue = faker.helpers.arrayElement(['true', 'false']);
        break;
      case 'string':
        defaultValue = faker.lorem.words({ min: 1, max: 2 });
    }

    return {
      id: itemIds.length > 0 ? itemIds[index] : faker.string.uuid(),
      ref_id: faker.lorem.slug({ min: 1, max: 4 }),
      title: faker.lorem.words({ min: 2, max: 3 }),
      description: faker.lorem.sentence({ min: 2, max: 4 }),
      value_type: valueType,
      default_value: defaultValue,
      type: 'value_definition',
    };
  });
};

export default buildValueDefinitions;
