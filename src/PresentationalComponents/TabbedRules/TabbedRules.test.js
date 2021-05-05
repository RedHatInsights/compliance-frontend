import TabbedRules, { profilesWithRulesToSelection } from './TabbedRules';
import { policies } from '@/__fixtures__/policies';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() =>({
        pathname: '/path/name',
        state: {}
    })),
    useHistory: () => ({
        push: jest.fn()
    })
}));

describe('TabbedRules', () => {
    it('renders tabs with default', () => {
        const profiles = policies.edges[0].node.policy.profiles;
        const tabsData = profiles.map((profile) => ({
            profile,
            newOsMinorVersion: profile.osMinorVersion ? undefined : '99'
        }));

        const wrapper = shallow(
            <TabbedRules tabsData={ tabsData } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders tabs with second item as default', () => {
        const profiles = policies.edges[0].node.policy.profiles;
        const tabsData = profiles.map((profile) => ({
            profile,
            newOsMinorVersion: profile.osMinorVersion ? undefined : '99'
        }));
        const defaultTab = {
            id: profiles[1].id,
            osMinorVersion: '99'
        };

        const wrapper = shallow(
            <TabbedRules tabsData={ tabsData } defaultTab={ defaultTab } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('passes setSelectedRuleRefIds via internal handleSelect', () => {
        const profiles = policies.edges[0].node.policy.profiles;
        const tabsData = profiles.map((profile) => ({
            profile,
            newOsMinorVersion: profile.osMinorVersion ? undefined : '99'
        }));

        const wrapper = shallow(
            <TabbedRules tabsData={ tabsData } setSelectedRuleRefIds={ () => {} } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('sets selected rule ref ids', () => {
        const profiles = policies.edges[0].node.policy.profiles;
        const tabsData = profiles.map((profile) => ({
            profile,
            newOsMinorVersion: profile.osMinorVersion ? undefined : '99'
        }));
        const selectedRuleRefIds = [
            {
                id: profiles[1].id,
                ruleRefIds: ['xccdf_org.ssgproject.content_rule_audit_rules_time_watch_localtime']
            }
        ];

        const wrapper = shallow(
            <TabbedRules tabsData={ tabsData } selectedRuleRefIds={ selectedRuleRefIds } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('profilesWithRulesToSelection', () => {
    const profiles = [
        {
            id: '1',
            rules: [
                { refId: 'profile1-rule1' },
                { refId: 'profile1-rule2' }
            ]
        },
        {
            id: '2',
            rules: [
                { refId: 'profile2-rule1' },
                { refId: 'profile2-rule2' }
            ]
        }
    ];

    const prevSelection = [
        {
            id: '1',
            ruleRefIds: ['profile1-rule3', 'profile1-rule4']
        },
        {
            id: '99',
            ruleRefIds: ['profile99-rule1', 'profile99-rule2']
        }
    ];

    it('converts profiles with rules to brand new selection', () => {
        const newSelection = profilesWithRulesToSelection(profiles);
        expect(newSelection).toMatchSnapshot();
    });

    it('converts profiles with rules to brand new selection using only option', () => {
        const newSelection = profilesWithRulesToSelection(profiles, undefined, { only: true });
        expect(newSelection).toMatchSnapshot();
    });

    it('appends new profiles with rules to a selection and keeps existing', () => {
        const newSelection = profilesWithRulesToSelection(profiles, prevSelection);
        expect(newSelection).toMatchSnapshot();
    });

    it('keeps existing profile rules selection if they match new profiles', () => {
        const newSelection = profilesWithRulesToSelection(profiles, prevSelection, { only: true });
        expect(newSelection).toMatchSnapshot();
    });

    it('errors gracefully on missing rules', () => {
        const profilesWithoutRules = [
            { id: '1' }, { id: '2' }
        ];

        const consoleError = jest.spyOn(console, 'error').mockImplementation();
        const newSelection = profilesWithRulesToSelection(profilesWithoutRules);
        expect(newSelection).toMatchSnapshot();
        expect(consoleError).toBeCalled();
        consoleError.mockRestore();
    });
});
