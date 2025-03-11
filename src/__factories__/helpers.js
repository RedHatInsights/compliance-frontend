import { faker } from '@faker-js/faker';

const DEFAULT_REFID_PREFIX = 'xccdf_org.ssgproject.';

export const refId = (type, sequence, { prefix } = {}) =>
  `${prefix || DEFAULT_REFID_PREFIX}content_${type}_${sequence}`;

export const id = () => ({
  id: faker.string.uuid(),
});

export const hostname = () =>
  [faker.internet.domainWord(), faker.internet.domainName(), 'test'].join('.');

export const randomNumbersArray = (count, min = 0, max = 10) =>
  faker.helpers.uniqueArray(() => faker.number.int({ min, max }), count);

export const randomStringsArray = (count) =>
  faker.helpers.uniqueArray(faker.word.sample, count);
