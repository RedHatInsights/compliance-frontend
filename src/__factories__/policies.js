import { faker } from '@faker-js/faker';

export const buildPolicies = (length) =>
  [...Array(length)].map(() => {
    const title = faker.lorem.words({ min: 2, max: 3 });
    const businessObjectiveString = faker.lorem.words(5);
    const businessPossibilities = [null, businessObjectiveString];
    const business_objective = faker.helpers.arrayElement(
      businessPossibilities,
    );
    return {
      id: faker.string.uuid(),
      title,
      description: faker.lorem.sentence({ min: 2, max: 4 }),
      business_objective,
      compliance_threshold: faker.number.int({ min: 1, max: 100 }),
      total_system_count: faker.number.int(5000),
      type: 'policy',
      os_major_version: faker.number.int({ min: 6, max: 9 }),
      profile_title: title,
      ref_id: faker.lorem.slug({ min: 1, max: 4 }),
    };
  });
