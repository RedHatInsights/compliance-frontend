import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { hostname } from './helpers';

const systemReportsFactory = Factory.define(() => ({
  id: faker.string.uuid(),
  title: hostname(),
  description: faker.lorem.sentence(),
  business_objective: Math.random() > 0.9 ? faker.lorem.sentence() : null,
  compliance_threshold: faker.number.float({
    min: 50,
    max: 100,
    fractionDigits: 1,
  }),
  type: 'report',
  os_major_version: faker.number.int({ min: 7, max: 10 }),
  profile_title: faker.lorem.words({ min: 3, max: 6 }),
  ref_id: faker.lorem.slug(),
  all_systems_exposed: false,
  percent_compliant: faker.number.float({
    min: 0,
    max: 100,
    fractionDigits: 1,
  }),
  compliant_system_count: faker.number.int({ min: 0, max: 10 }),
  unsupported_system_count: 0,
  reported_system_count: 10,
}));

export default systemReportsFactory;
