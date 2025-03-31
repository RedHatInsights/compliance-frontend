import { faker } from '@faker-js/faker';

export const buildSecurityGuides = (length) =>
  [...Array(length)].map(() => {
    return {
      id: faker.string.uuid(),
      ref_id: faker.lorem.slug({ min: 1, max: 4 }),
      title: faker.lorem.words({ min: 2, max: 3 }),
      version: `0.1.${faker.number.int({ min: 50, max: 99 })}`,
      description: faker.lorem.sentence({ min: 2, max: 4 }),
      os_major_version: faker.number.int({ min: 6, max: 9 }),
      type: 'security_guide',
    };
  });

export const buildSecurityGuide = (props) => {
  return {
    id: props.id ? props.id : faker.string.uuid(),
    ref_id: props.ref_id ? props.ref_id : faker.lorem.slug({ min: 1, max: 4 }),
    title: props.title ? props.title : faker.lorem.words({ min: 2, max: 3 }),
    version: props.version
      ? props.version
      : `0.1.${faker.number.int({ min: 50, max: 99 })}`,
    description: faker.lorem.sentence({ min: 2, max: 4 }),
    os_major_version: props.os_major_version
      ? props.os_major_version
      : faker.number.int({ min: 6, max: 9 }),
    type: 'security_guide',
  };
};
