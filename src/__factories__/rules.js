import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { refId } from './helpers';
import { SEVERITY_LEVELS } from '@/constants';

const rulesFactory = Factory.define(({ sequence, params, transientParams }) => {
  const rulePrefix =
    transientParams.profile?.name
      ?.replaceAll(' ', '-')
      .replaceAll('#', '')
      .toLowerCase() || '';
  const title = `${
    transientParams.profile
      ? transientParams.profile.name
      : 'Test Result Profile'
  } Rule #${sequence}`;

  return {
    refId: refId(rulePrefix ? `${rulePrefix}_rule` : 'rule', sequence),
    title,
    compliant: true,
    remediationAvailable: true,
    severity: faker.helpers.arrayElement(SEVERITY_LEVELS),
    ...(sequence ? { precedence: sequence } : {}),
    ...params,
  };
});

export const buildRules = (length, itemIds = []) =>
  [...Array(itemIds.length || length)].map((_, index) => {
    let refId = faker.lorem.slug({ min: 1, max: 4 });
    let remediationAvailable = faker.datatype.boolean();
    let valueChecksRandomList = Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      () => faker.string.uuid()
    );
    let rhelVersion = faker.number.int({ min: 6, max: 9 });
    const profileSlug = faker.lorem.slug({ min: 3, max: 4 });

    return {
      id: itemIds[index]?.id || faker.string.uuid(),
      ref_id: refId,
      title: faker.lorem.words({ min: 2, max: 3 }),
      rationale: faker.lorem.sentence({ min: 2, max: 4 }),
      description: faker.lorem.sentence({ min: 2, max: 4 }),
      severity: faker.helpers.arrayElement(SEVERITY_LEVELS),
      precedence: faker.number.int({ min: 1, max: 999 }),
      identifier: {
        label: `CEE-${faker.number.int({ min: 100, max: 1000 })}`,
        system: faker.internet.url(),
      },
      references: [
        {
          href: faker.internet.url(),
          label: faker.lorem.slug({ min: 1, max: 4 }),
        },
      ],
      value_checks: faker.helpers.arrayElement([[], valueChecksRandomList]),
      remediation_available: remediationAvailable,
      rule_group_id: itemIds[index]?.groupId || faker.string.uuid(),
      type: 'rule',
      remediation_issue_id: remediationAvailable
        ? `ssg:rhel${rhelVersion}|${profileSlug}|${refId}`
        : null,
    };
  });

export const nonComplianceRules = rulesFactory.params({
  compliant: false,
});

export const manualRules = rulesFactory.params({
  remediationAvailable: false,
});

export default rulesFactory;
