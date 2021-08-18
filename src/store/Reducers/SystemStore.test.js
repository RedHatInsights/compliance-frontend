import { mapCountOsMinorVersions, countOsMinorVersions } from './SystemStore';

describe('mapCountOsMinorVersions', () => {
  it('maps host counts by osMinorVersion', () => {
    const systems = [
      { osMinorVersion: 10 },
      { osMinorVersion: 1 },
      { osMinorVersion: 9 },
      { osMinorVersion: 9 },
      { osMinorVersion: 0 },
      {},
    ];
    expect(mapCountOsMinorVersions(systems)).toEqual({
      0: { osMinorVersion: 0, count: 1 },
      1: { osMinorVersion: 1, count: 1 },
      10: { osMinorVersion: 10, count: 1 },
      9: { osMinorVersion: 9, count: 2 },
    });
  });
});

describe('countOsMinorVersions', () => {
  it('gathers unique OS minor versions sorted', () => {
    const systems = [
      { osMinorVersion: 10 },
      { osMinorVersion: 1 },
      { osMinorVersion: 9 },
      { osMinorVersion: 9 },
      { osMinorVersion: 0 },
      {},
    ];
    expect(countOsMinorVersions(systems)).toEqual([
      { osMinorVersion: 10, count: 1 },
      { osMinorVersion: 9, count: 2 },
      { osMinorVersion: 1, count: 1 },
      { osMinorVersion: 0, count: 1 },
    ]);
  });
});
