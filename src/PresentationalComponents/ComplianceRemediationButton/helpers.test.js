import buildSystems, {
  buildNonCompliantSystems,
  buildUnsupportedSystems,
} from '@/__factories__/systems';

import { provideData } from './helpers';

describe('provideData', () => {
  const systems = buildSystems();
  const nonComplianceSystems = buildNonCompliantSystems();
  const unsupportedSystems = buildUnsupportedSystems();

  it('returns an object', async () => {
    expect(await provideData()).toEqual({});
  });

  it('when passed systems it returns an object with an array of issues with systems', () => {
    expect(
      provideData({
        systems: [...systems, ...nonComplianceSystems, ...unsupportedSystems],
      })
    ).toMatchSnapshot();
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
        selectedRules: [{ refId: 'xccdf_org.ssgproject.profile_5_rule_13' }],
      }).issues?.length
    ).toEqual(1);
  });
});
