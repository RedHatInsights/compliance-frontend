import { faker } from '@faker-js/faker';

export const buildTailorings = (length) =>
  [...Array(length)].map(() => {
    return {
      id: faker.string.uuid(),
      profile_id: faker.string.uuid(),
      os_minor_version: faker.number.int({ min: 1, max: 9 }),
      value_overrides: {},
      // value_overrides: {
      //   "130560a7-08ab-4928-bc8d-81cadb66866b": "-1",
      //   faker.string.uuid(): faker.number.int({ min: 1, max: 999 }),
      // }
      type: 'tailoring',
      os_major_version: faker.number.int({ min: 6, max: 9 }),
      security_guide_id: faker.string.uuid(),
      security_guide_version: `0.1.${faker.number.int({ min: 50, max: 99 })}`,
    };
  });
