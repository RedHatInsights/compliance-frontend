import {
  systemRulesPassed,
  systemRulesFailed,
  profilesRulesPassed,
  profilesRulesFailed,
  systemsWithRuleObjectsFailed,
} from './ruleHelpers';

describe('passed count', () => {
  it('should set rules passed as the sum over all profiles', () => {
    const system = {
      testResultProfiles: [
        { rules: [{ compliant: false }, { compliant: true }] },
        {
          rules: [
            { compliant: false },
            { compliant: true },
            { compliant: true },
          ],
        },
      ],
    };
    expect(systemRulesPassed(system).length).toEqual(3);
    expect(profilesRulesPassed([system.testResultProfiles[0]]).length).toEqual(
      1
    );
    expect(profilesRulesPassed([system.testResultProfiles[1]]).length).toEqual(
      2
    );
  });

  it('should set rules count even if profiles is an empty array', () => {
    const system = { testResultProfiles: [] };
    expect(systemRulesPassed(system).length).toEqual(0);
  });
});

describe('fail count', () => {
  it('should set rules passed as the sum over all profiles', () => {
    const system = {
      testResultProfiles: [
        { rules: [{ compliant: false }, { compliant: false }] },
        {
          rules: [
            { compliant: false },
            { compliant: false },
            { compliant: true },
          ],
        },
      ],
    };
    expect(systemRulesFailed(system).length).toEqual(4);
    expect(profilesRulesFailed([system.testResultProfiles[0]]).length).toEqual(
      2
    );
    expect(profilesRulesFailed([system.testResultProfiles[1]]).length).toEqual(
      2
    );
  });

  it('should set rules count even if profiles is an empty array', () => {
    const system = { testResultProfiles: [] };
    expect(systemRulesFailed(system).length).toEqual(0);
  });
});

describe('simulate ruleObjectsFailed', () => {
  it('creates a system with ruleObjectsFailed based on profile failing rules', () => {
    const system = {
      testResultProfiles: [
        {
          rules: [
            { title: 'a', compliant: true },
            { title: 'b', compliant: false },
          ],
        },
        {
          rules: [
            { title: 'c', compliant: false },
            { title: 'd', compliant: false },
            { title: 'e', compliant: true },
          ],
        },
      ],
    };
    expect(systemsWithRuleObjectsFailed([system])).toMatchSnapshot();
  });

  it('should set rule objects failed even if some have no profiles or rules', () => {
    const systems = [
      { testResultProfiles: [] },
      { testResultProfiles: [{ rules: [] }] },
      {
        testResultProfiles: [
          {
            rules: [
              { title: 'a', compliant: true },
              { title: 'b', compliant: false },
            ],
          },
        ],
      },
    ];
    expect(systemsWithRuleObjectsFailed(systems)).toMatchSnapshot();
  });

  it('creates a system with supported property', () => {
    const system = {
      testResultProfiles: [
        {
          supported: true,
          rules: [
            { title: 'a', compliant: true },
            { title: 'b', compliant: false },
          ],
        },
        {
          supported: true,
          rules: [
            { title: 'c', compliant: false },
            { title: 'd', compliant: false },
            { title: 'e', compliant: true },
          ],
        },
      ],
    };
    expect(systemsWithRuleObjectsFailed([system])).toMatchSnapshot();
  });
});
