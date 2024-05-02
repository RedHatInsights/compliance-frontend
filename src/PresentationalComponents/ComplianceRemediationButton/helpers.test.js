import { faker } from '@faker-js/faker';
import {
  buildNonCompliantSystems,
  buildUnsupportedSystems,
  buildSystemsWithTestResultProfiles,
} from '@/__factories__/systems';

import { provideData } from './helpers';

describe('provideData', () => {
  const systems = buildSystemsWithTestResultProfiles(55);
  const nonComplianceSystems = buildNonCompliantSystems();
  const unsupportedSystems = buildUnsupportedSystems();
  const randomSystem = faker.helpers.arrayElement(nonComplianceSystems);
  const randomNonCompliantProfile = faker.helpers.arrayElement(
    randomSystem.testResultProfiles.filter(({ compliant }) => !compliant)
  );
  const randomFailedRule = faker.helpers.arrayElement(
    randomNonCompliantProfile.rules.filter(
      ({ compliant, remediationAvailable }) =>
        !compliant && remediationAvailable
    )
  );

  it('returns an object', () => {
    expect(provideData()).toEqual({});
  });

  it('when passed systems it returns an object with an array of issues with systems', () => {
    expect(
      provideData({
        systems: [...systems, ...nonComplianceSystems, ...unsupportedSystems],
      })
        .issues.find(({ id }) => id.endsWith(randomFailedRule.refId))
        .systems.includes(randomSystem.id)
    ).toBeTruthy();
  });

  it('should not return any issues for unsupported systems', () => {
    expect(
      provideData({
        systems: unsupportedSystems,
      }).issues
    ).toBeUndefined();
  });

  it('should not return only selected issues', () => {
    expect(
      provideData({
        systems: nonComplianceSystems,
        selectedRules: [{ refId: randomFailedRule.refId }],
      }).issues.length
    ).toEqual(1);
  });
});
