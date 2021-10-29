import buildSystems, {
  buildNonCompliantSystems,
  buildUnsupportedSystems,
} from '@/__factories__/systems';
import {
  compliantSystemsData,
  nonCompliantSystemsData,
  unsupportedSystemsData,
  topTenFailedRulesData,
  sortBySystemsCount,
  topTenFromRulesWithCounts,
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

describe('sortBySystemsCount', () => {
  it('rules sorted desc by systems count', () => {
    const testRules = [
      { name: 'First', systemsCount: 10 },
      { name: 'Second', systemsCount: 5 },
      { name: 'Third', systemsCount: 1 },
      { name: 'Fourth', systemsCount: 0 },
    ];

    expect(sortBySystemsCount(testRules)).toMatchSnapshot();
  });
});

describe('topTenFromRulesWithCounts', () => {
  it('rules sorted by severity and systems count', () => {
    const testRules = [
      { name: '1', severity: 'high', systemsCount: 10 },
      { name: '2', severity: 'high', systemsCount: 5 },
      { name: '3', severity: 'low', systemsCount: 13 },
      { name: '4', severity: 'low', systemsCount: 10 },
      { name: '5', severity: 'medium', systemsCount: 3 },
      { name: '6', severity: 'medium', systemsCount: 1 },
      { name: '7', severity: 'unknown', systemsCount: 4 },
      { name: '8', severity: 'unknown', systemsCount: 5 },
      { name: '9', severity: 'unknown', systemsCount: 3 },
      { name: '10', severity: 'unknown', systemsCount: 2 },
      { name: '11', severity: 'unknown', systemsCount: 1 },
      { name: '12', severity: 'unknown', systemsCount: 0 },
    ];

    expect(topTenFromRulesWithCounts(testRules)).toMatchSnapshot();
  });

  it('rules sorted by severity and systems count #2', () => {
    const testRules = [
      { name: '1', severity: 'high', systemsCount: 1 },
      { name: '2', severity: 'high', systemsCount: 1 },
      { name: '3', severity: 'medium', systemsCount: 1 },
      { name: '4', severity: 'medium', systemsCount: 1 },
      { name: '5', severity: 'low', systemsCount: 1 },
      { name: '6', severity: 'low', systemsCount: 1 },
      { name: '7', severity: 'unknown', systemsCount: 1 },
      { name: '8', severity: 'unknown', systemsCount: 1 },
      { name: '9', severity: 'unknown', systemsCount: 1 },
      { name: '10', severity: 'unknown', systemsCount: 1 },
      { name: '11', severity: 'unknown', systemsCount: 1 },
      { name: '12', severity: 'unknown', systemsCount: 1 },
    ];

    expect(topTenFromRulesWithCounts(testRules)).toMatchSnapshot();
  });

  it('rules sorted by severity and systems count', () => {
    const testRules = [
      { name: '1', severity: 'high', systemsCount: 15 },
      { name: '2', severity: 'high', systemsCount: 10 },
      { name: '3', severity: 'high', systemsCount: 11 },
      { name: '4', severity: 'high', systemsCount: 10 },
      { name: '11', severity: 'unknown', systemsCount: 20 },
      { name: '12', severity: 'unknown', systemsCount: 0 },
      { name: '5', severity: 'high', systemsCount: 7 },
      { name: '6', severity: 'high', systemsCount: 5 },
      { name: '7', severity: 'high', systemsCount: 4 },
      { name: '8', severity: 'high', systemsCount: 3 },
      { name: '9', severity: 'high', systemsCount: 1 },
      { name: '10', severity: 'high', systemsCount: 0 },
    ];

    expect(topTenFromRulesWithCounts(testRules)).toMatchSnapshot();
  });
});
