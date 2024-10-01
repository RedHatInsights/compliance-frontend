import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { randomStringsArray, hostname } from './helpers';
import { tagsFactory } from './testResults';

const systemsFactory = Factory.define(({ sequence, params }) => ({
  insights_id: faker.string.uuid(),
  tags: tagsFactory.buildList(5),
  culled_timestamp: faker.date.past(),
  stale_timestamp: faker.date.past(),
  stale_warning_timestamp: faker.date.past(),
  updated: faker.date.past(),
  type: 'system',
  display_name: hostname(),
  groups: randomStringsArray(5),
  os_major_version: faker.number.int(10),
  os_minor_version: faker.number.int(100),
  policies: [],
  ...(sequence ? { id: sequence } : {}),
  ...params,
}));

export default systemsFactory;
