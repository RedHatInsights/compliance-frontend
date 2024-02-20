import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { id, hostname } from './helpers';
import { testResultProfiles, buildNonCompliantProfiles } from './profiles';

const systemsFactory = Factory.define(({ params, transientParams }) => {
  const [osMajorVersion, osMinorVersion] = transientParams.osVersions
    ? faker.helpers.arrayElement(transientParams.osVersions).split('.')
    : [];

  return {
    ...id(),
    name: hostname(),
    ...(osMajorVersion
      ? {
          osMajorVersion,
          osMinorVersion,
        }
      : {}),
    ...params,
  };
});

export const buildNonCompliantSystems = (count = 5) =>
  systemsFactory.buildList(count, {
    compliant: false,
    testResultProfiles: [
      ...buildNonCompliantProfiles(),
      ...testResultProfiles.buildList(5),
    ],
  });

export const buildUnsupportedSystems = (count = 5) =>
  systemsFactory.buildList(count, {
    compliant: false,
    testResultProfiles: [...buildNonCompliantProfiles(2, { supported: false })],
  });

export const buildSystemsWithTestResultProfiles = (count = 5, params = {}) =>
  systemsFactory.buildList(count, {
    compliant: params.compliant || false,
    testResultProfiles: [
      ...(!params.compliant ? buildNonCompliantProfiles() : []),
      ...testResultProfiles.buildList(5),
    ],
    ...params,
  });

export default systemsFactory;
