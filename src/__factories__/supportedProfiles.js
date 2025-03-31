import { faker } from '@faker-js/faker';

export const buildSupportedProfiles = (length) =>
  [...Array(length)].map(() => {
    return {
      id: faker.string.uuid(),
      title: faker.lorem.words({ min: 2, max: 3 }),
      description: faker.lorem.sentence({ min: 2, max: 4 }),
      ref_id: faker.lorem.slug({ min: 1, max: 4 }),
      security_guide_id: faker.string.uuid(),
      security_guide_version: `0.1.${faker.number.int({ min: 50, max: 99 })}`, // ?
      os_major_version: faker.number.int({ min: 6, max: 9 }),
      os_minor_versions: [5, 4, 3, 2, 1, 0],
      type: 'supported_profile',
    };
  });
