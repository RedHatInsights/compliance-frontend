// Policies are based on canonical profiles with systems assigned as well as rules assigned with the canonical profiles' rules as a default
import { faker } from '@faker-js/faker';

export const buildPolicies = (length) => ({
  profiles: {
    edges: [...Array(length)].map(() => {
      const id = faker.string.uuid();
      const name = faker.lorem.words({ min: 2, max: 3 });
      const businessObjectiveString = faker.lorem.words(5);
      const businessPossibilities = [null, { title: businessObjectiveString }];
      const businessObjective = faker.helpers.arrayElement(
        businessPossibilities
      );
      return {
        node: {
          id,
          name,
          description: faker.lorem.sentence({ min: 2, max: 4 }),
          refId: faker.lorem.slug({ min: 1, max: 4 }),
          complianceThreshold: faker.number.int({ min: 1, max: 100 }),
          totalHostCount: faker.number.int(5000),
          osMajorVersion: faker.string.numeric({ min: 6, max: 9 }),
          policyType: name,
          policy: {
            id,
            name,
          },
          businessObjective,
        },
      };
    }),
  },
});

export const buildPoliciesV2 = (length) =>
  [...Array(length)].map(() => {
    const title = faker.lorem.words({ min: 2, max: 3 });
    const businessObjectiveString = faker.lorem.words(5);
    const businessPossibilities = [null, businessObjectiveString];
    const business_objective = faker.helpers.arrayElement(
      businessPossibilities
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
