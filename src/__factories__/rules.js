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

export const nonComplianceRules = rulesFactory.params({
  compliant: false,
});

export const manualRules = rulesFactory.params({
  remediationAvailable: false,
});

export default rulesFactory;
