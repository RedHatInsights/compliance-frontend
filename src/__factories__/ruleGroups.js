import { faker } from '@faker-js/faker';

export const buildRuleGroups = (length, itemIds = []) => {
  const count = itemIds.length > 0 ? itemIds.length : length;

  return [...Array(count)].map((_, index) => ({
    id: itemIds.length > 0 ? itemIds[index] : faker.string.uuid(),
    ref_id: faker.lorem.slug({ min: 1, max: 4 }),
    title: faker.lorem.words({ min: 2, max: 3 }),
    rationale: faker.lorem.sentence({ min: 2, max: 4 }),
    description: faker.lorem.sentence({ min: 2, max: 4 }),
    precedence: faker.number.int({ min: 1, max: 999 }),
    type: 'rule_group',
  }));
};
