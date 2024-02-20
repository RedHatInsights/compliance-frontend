import { faker } from '@faker-js/faker';
import {
  buildNonCompliantSystems,
  buildUnsupportedSystems,
  buildSystemsWithTestResultProfiles,
} from '@/__factories__/systems';
import {
  compliantSystemsData,
  nonCompliantSystemsData,
  unsupportedSystemsData,
} from './helpers';

const compliantSystems = buildSystemsWithTestResultProfiles(10, {
  compliant: true,
});
const randomCompliantSystem = faker.helpers.arrayElement(compliantSystems);
const nonCompliantSystems = buildNonCompliantSystems();
const randomNonCompliantSystem =
  faker.helpers.arrayElement(nonCompliantSystems);
const unsupportedSystems = buildUnsupportedSystems();
const randomUnsupportedSystems = faker.helpers.arrayElement(unsupportedSystems);

const allSystems = [
  ...compliantSystems,
  ...nonCompliantSystems,
  ...unsupportedSystems,
];

describe('compliantSystemsData', () => {
  it('returns compliant systems', () => {
    expect(
      compliantSystemsData(allSystems)
        .map((system) => system.name)
        .includes(randomCompliantSystem.name)
    ).toBeTruthy();

    expect(
      compliantSystemsData(allSystems)
        .map((system) => system.name)
        .includes(randomNonCompliantSystem.name)
    ).toBeFalsy();
  });
});

describe('nonCompliantSystemsData', () => {
  it('returns non-compliant systems', () => {
    expect(
      nonCompliantSystemsData(allSystems)
        .map((system) => system.name)
        .includes(randomCompliantSystem.name)
    ).toBeFalsy();

    expect(
      nonCompliantSystemsData(allSystems)
        .map((system) => system.name)
        .includes(randomNonCompliantSystem.name)
    ).toBeTruthy();
  });
});

describe('unsupportedSystemsData', () => {
  it('returns unsupported systems', () => {
    expect(
      unsupportedSystemsData(allSystems)
        .map((system) => system.name)
        .includes(randomCompliantSystem.name)
    ).toBeFalsy();

    expect(
      unsupportedSystemsData(allSystems)
        .map((system) => system.name)
        .includes(randomUnsupportedSystems.name)
    ).toBeTruthy();
  });
});
