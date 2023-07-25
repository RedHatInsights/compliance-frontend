import buildSystems, {
  buildNonCompliantSystems,
  buildUnsupportedSystems,
} from '@/__factories__/systems';
import {
  compliantSystemsData,
  nonCompliantSystemsData,
  unsupportedSystemsData,
} from './helpers';

describe('compliantSystemsData', () => {
  it('returns compliant systems', () => {
    const compliantSystems = buildSystems();
    expect(
      compliantSystemsData(compliantSystems).map((system) => system.name)
    ).toMatchSnapshot();
  });
});

describe('nonCompliantSystemsData', () => {
  it('returns non-compliant systems', () => {
    const nonCompliantSystems = buildNonCompliantSystems();
    expect(
      nonCompliantSystemsData(nonCompliantSystems).map((system) => system.name)
    ).toMatchSnapshot();
  });
});

describe('unsupportedSystemsData', () => {
  it('returns unsupported systems', () => {
    const unsupportedSystems = buildUnsupportedSystems();
    expect(
      unsupportedSystemsData(unsupportedSystems).map((system) => system.name)
    ).toMatchSnapshot();
  });
});
