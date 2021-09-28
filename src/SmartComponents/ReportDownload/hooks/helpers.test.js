import buildSystems, {
  buildNonCompliantSystems,
  buildUnsupportedSystems,
} from '@/__factories__/systems';
import {
  compliantSystemsData,
  nonCompliantSystemsData,
  unsupportedSystemsData,
  topTenFailedRulesData,
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

describe('topTenFailedRulesData', () => {
  it('returns top 10 failed', () => {
    const nonCompliantSystems = buildNonCompliantSystems(100);
    expect(
      topTenFailedRulesData(nonCompliantSystems).map((rule) => rule.title)
    ).toMatchSnapshot();
  });

  it('returns top 10 failed only for supported systems', () => {
    const sortedRuleTitles = (systems) =>
      topTenFailedRulesData(systems)
        .map((rule) => rule.title)
        .sort((title) => title);
    const nonCompliantSystems = buildNonCompliantSystems(10);
    const nonComplianAndUnsupportedSystems = [
      buildUnsupportedSystems(10),
      ...nonCompliantSystems,
    ];

    expect(sortedRuleTitles(nonCompliantSystems)).toEqual(
      sortedRuleTitles(nonComplianAndUnsupportedSystems)
    );
  });
});
