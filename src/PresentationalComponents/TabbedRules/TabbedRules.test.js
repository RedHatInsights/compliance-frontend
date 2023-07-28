import TabbedRules from './TabbedRules';
import { policies } from '@/__fixtures__/policies';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({
    pathname: '/path/name',
    state: {},
  })),
}));

describe('TabbedRules', () => {
  it('renders tabs with default', () => {
    const profiles = policies.edges[0].node.policy.profiles;
    const tabsData = profiles.map((profile) => ({
      profile,
      newOsMinorVersion: profile.osMinorVersion ? undefined : '99',
    }));

    const wrapper = shallow(<TabbedRules tabsData={tabsData} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders tabs with second item as default', () => {
    const profiles = policies.edges[0].node.policy.profiles;
    const tabsData = profiles.map((profile) => ({
      profile,
      newOsMinorVersion: profile.osMinorVersion ? undefined : '99',
    }));
    const defaultTab = {
      id: profiles[1].id,
      osMinorVersion: '99',
    };

    const wrapper = shallow(
      <TabbedRules tabsData={tabsData} defaultTab={defaultTab} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('passes setSelectedRuleRefIds via internal handleSelect', () => {
    const profiles = policies.edges[0].node.policy.profiles;
    const tabsData = profiles.map((profile) => ({
      profile,
      newOsMinorVersion: profile.osMinorVersion ? undefined : '99',
    }));

    const wrapper = shallow(
      <TabbedRules tabsData={tabsData} setSelectedRuleRefIds={() => {}} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('sets selected rule ref ids', () => {
    const profiles = policies.edges[0].node.policy.profiles;
    const tabsData = profiles.map((profile) => ({
      profile,
      newOsMinorVersion: profile.osMinorVersion ? undefined : '99',
    }));
    const selectedRuleRefIds = [
      {
        id: profiles[1].id,
        osMinorVersion: '99',
        ruleRefIds: [
          'xccdf_org.ssgproject.content_rule_audit_rules_time_watch_localtime',
        ],
      },
    ];

    const wrapper = shallow(
      <TabbedRules
        tabsData={tabsData}
        selectedRuleRefIds={selectedRuleRefIds}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
