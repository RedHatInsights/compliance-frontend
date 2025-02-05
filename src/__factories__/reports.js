import { faker } from '@faker-js/faker';

export const buildReports = (length) =>
  [...Array(length)].map(() => {
    const title = faker.lorem.words({ min: 2, max: 5 });
    const assigned_system_count = faker.number.int({ min: 0, max: 100 });
    const compliant_system_count = faker.number.int({
      min: 0,
      max: assigned_system_count,
    });
    const percent_compliant =
      assigned_system_count > 0
        ? Math.round((compliant_system_count / assigned_system_count) * 100)
        : 0;
    const reported_system_count = faker.number.int({
      min: compliant_system_count,
      max: assigned_system_count,
    });
    const max_number_unsupported_systems =
      reported_system_count - compliant_system_count;
    const unsupported_system_count = faker.number.int({
      min: 0,
      max: max_number_unsupported_systems,
    });
    // TODO: we will probably need to fix it after https://issues.redhat.com/browse/RHINENG-14550
    return {
      id: faker.string.uuid(),
      title,
      description: faker.lorem.paragraph(),
      business_objective: faker.helpers.arrayElement([
        null,
        faker.lorem.words(5),
      ]),
      compliance_threshold: faker.number.float({
        min: 0,
        max: 100,
        precision: 0.1,
      }),
      type: 'report',
      os_major_version: faker.number.int({ min: 6, max: 9 }),
      profile_title: title,
      ref_id: faker.lorem.slug({ min: 1, max: 4 }),
      all_systems_exposed: true,
      percent_compliant: percent_compliant,
      assigned_system_count: assigned_system_count,
      compliant_system_count: compliant_system_count,
      unsupported_system_count: unsupported_system_count,
      reported_system_count: reported_system_count,
    };
  });
