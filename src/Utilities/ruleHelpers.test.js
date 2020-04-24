import {
    systemRulesPassed,
    systemRulesFailed,
    profilesRulesPassed,
    profilesRulesFailed,
    systemsWithRuleObjectsFailed
} from './ruleHelpers';

describe('passed count', () => {
    it('should set rules passed as the sum over all profiles', () => {
        const system = {
            profiles: [
                { rules: [{ compliant: false }, { compliant: true }] },
                { rules: [{ compliant: false }, { compliant: true }, { compliant: true }] }
            ]
        };
        expect(systemRulesPassed(system).length).toEqual(3);
        expect(profilesRulesPassed([system.profiles[0]]).length).toEqual(1);
        expect(profilesRulesPassed([system.profiles[1]]).length).toEqual(2);
    });

    it('should set rules count even if profiles is an empty array', () => {
        const system = { profiles: [] };
        expect(systemRulesPassed(system).length).toEqual(0);
    });
});

describe('fail count', () => {
    it('should set rules passed as the sum over all profiles', () => {
        const system = {
            profiles: [
                { rules: [{ compliant: false }, { compliant: false }] },
                { rules: [{ compliant: false }, { compliant: false }, { compliant: true }] }
            ]
        };
        expect(systemRulesFailed(system).length).toEqual(4);
        expect(profilesRulesFailed([system.profiles[0]]).length).toEqual(2);
        expect(profilesRulesFailed([system.profiles[1]]).length).toEqual(2);
    });

    it('should set rules count even if profiles is an empty array', () => {
        const system = { profiles: [] };
        expect(systemRulesFailed(system).length).toEqual(0);
    });
});

describe('simulate ruleObjectsFailed', () => {
    it('creates a system with ruleObjectsFailed based on profile failing rules', () => {
        const system = {
            profiles: [
                { rules: [{ title: 'a', compliant: true }, { title: 'b', compliant: false }] },
                { rules: [{ title: 'c', compliant: false }, { title: 'd', compliant: false }, { title: 'e', compliant: true }] }
            ]
        };
        expect(systemsWithRuleObjectsFailed([system])).toEqual(
            [{
                profiles: system.profiles,
                ruleObjectsFailed: [
                    { compliant: false, title: 'b' }, { compliant: false, title: 'c' }, { compliant: false, title: 'd' }
                ]
            }]
        );
    });

    it('should set rule objects failed even if some have no profiles or rules', () => {
        const systems = [
            { profiles: [] },
            { profiles: [{ rules: [] }] },
            { profiles: [{ rules: [{ title: 'a', compliant: true }, { title: 'b', compliant: false }] }] }
        ];
        expect(systemsWithRuleObjectsFailed(systems)).toEqual(
            [
                {
                    profiles: [],
                    ruleObjectsFailed: []
                },
                {
                    profiles: [
                        {
                            rules: []
                        }
                    ],
                    ruleObjectsFailed: []
                },
                {
                    profiles: [
                        {
                            rules: [
                                {
                                    compliant: true,
                                    title: 'a'
                                },
                                {
                                    compliant: false,
                                    title: 'b'
                                }
                            ]
                        }
                    ],
                    ruleObjectsFailed: [
                        {
                            compliant: false,
                            title: 'b'
                        }
                    ]
                }
            ]
        );
    });
});

