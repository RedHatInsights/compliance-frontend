import { callAndSort } from './helpers';
import buildProfiles, { buildNonCompliantProfiles } from './profiles';

const buildSystem = (currentCount, attributes = {}) => ({
  id: `system-id-${currentCount}`,
  name: `system${currentCount}.hosts.example.com`,
  testResultProfiles: buildProfiles(5),
  ...attributes,
});

export const buildNonCompliantSystems = (count = 5) =>
  callAndSort(buildSystem, count, {
    funcArguments: [
      {
        compliant: false,
        testResultProfiles: [
          ...buildNonCompliantProfiles(),
          ...buildProfiles(),
        ],
      },
    ],
  });

export const buildUnsupportedSystems = (count = 5) =>
  callAndSort(buildSystem, count, {
    funcArguments: [
      {
        compliant: false,
        testResultProfiles: [
          ...buildNonCompliantProfiles(2, { supported: false }),
        ],
      },
    ],
  });

const buildSystems = (count = 5) => callAndSort(buildSystem, count);

export default buildSystems;
