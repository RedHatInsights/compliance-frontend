import { faker } from '@faker-js/faker';

export const buildTestResults = (length) =>
  [...Array(length)].map(() => {
    return {
      id: faker.string.uuid(),
      title: faker.lorem.words({ min: 2, max: 3 }),
      result: faker.helpers.arrayElement(['pass', 'fail']),
      rule_id: faker.string.uuid(),
      type: 'rule_result',
      system_id: faker.string.uuid(),
      rule_group_id: faker.string.uuid(),
      description: faker.lorem.sentence({ min: 2, max: 4 }),
      rationale: faker.lorem.sentence({ min: 2, max: 4 }),
      severity: faker.helpers.arrayElement(['low', 'medium', 'high']),
      precedence: faker.number.int({ min: 1, max: 1000 }),
      identifier: {
        label: faker.lorem.words({ min: 2, max: 3 }),
        system: faker.internet.url(),
      },
      references: [
        {
          href: faker.internet.url(),
          label: faker.lorem.words({ min: 2, max: 3 }),
        },
      ],
      remediation_issue_id: null,
      ref_id: faker.lorem.slug({ min: 1, max: 4 }),
    };
  });
