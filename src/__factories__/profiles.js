import { callAndSort } from './helpers';
import { SEVERITY_LEVELS } from '@/constants';

const buildRule = (
  currentCount = 0,
  { parentCount = 0, ...attributes } = {}
) => ({
  refId: `xccdf_org.ssgproject.profile_${parentCount}_rule_${currentCount}`,
  title: `Profile #${parentCount} Rule #${currentCount}`,
  compliant: true,
  severity: SEVERITY_LEVELS[currentCount % SEVERITY_LEVELS.length],
  ...attributes,
});

const buildRules = (count = 5, attributes = {}, offset = 0) =>
  callAndSort(buildRule, count, { funcArguments: [attributes], offset });

const buildProfile = (currentCount, attributes = {}) => ({
  name: `Test Result Profile #${currentCount}`,
  lastScanned: new Date('2021-08-31T00:00:00+00:00'),
  rules: buildRules(),
  compliant: true,
  ssgVersion: '0.14.5',
  supported: true,
  ...attributes,
});

const buildProfiles = (count = 5, attributes = {}) =>
  callAndSort(buildProfile, count, { funcArguments: [attributes] });

export const buildNonCompliantProfiles = (count = 5, attributes = {}) =>
  callAndSort(buildProfile, count, {
    funcArguments: [
      {
        compliant: false,
        rules: [
          ...buildRules(15, { compliant: false, parentCount: count }),
          ...buildRules(15, { parentCount: count }),
        ],
        ...attributes,
      },
    ],
  });

export default buildProfiles;
