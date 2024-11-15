import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { randomStringsArray, hostname } from './helpers';

export const tagsFactory = Factory.define(({ params }) => {
  const namespaces = randomStringsArray(5);

  return {
    key: faker.string.symbol({ min: 5, max: 10 }),
    value: faker.word,
    namespace: params?.namespace || faker.helpers.arrayElement(namespaces),
  };
});

const testResultsFactory = Factory.define(({ sequence, params }) => ({
  system_id: faker.string.uuid(),
  tags: tagsFactory.buildList(5),
  end_time: String(faker.date.past()),
  failed_rule_count: faker.number.int(10),
  score: faker.number.int(100),
  type: 'test_result',
  display_name: hostname(),
  groups: randomStringsArray(5),
  compliant: Math.random() > 0.5,
  supported: true,
  os_major_version: faker.number.int(10),
  os_minor_version: faker.number.int(100),
  security_guide_version: faker.system.semver(),
  ...(sequence ? { id: sequence } : {}),
  ...params,
}));

export const compliantSystems = testResultsFactory.params({
  compliant: true,
});

export const nonCompliantSystems = testResultsFactory.params({
  compliant: false,
});

export const supportedSystems = testResultsFactory.params({
  supported: true,
});

export const unsupportedSystems = testResultsFactory.params({
  supported: false,
});
export default testResultsFactory;
