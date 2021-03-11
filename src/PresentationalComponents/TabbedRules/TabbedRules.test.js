import TabbedRules from './TabbedRules';
import { policies } from '@/__fixtures__/policies';
import { TabTitleText } from '@patternfly/react-core';

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
        const tabsData =  profiles.map((profile) => (
            {
                title: (<TabTitleText>TabTitle</TabTitleText>),
                profile,
                rules: profile.rules
            }
        ));

        const wrapper = shallow(
            <TabbedRules tabsData={ tabsData } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders tabs with second item as default', () => {
        const profiles = policies.edges[0].node.policy.profiles;
        const tabsData =  profiles.map((profile) => (
            {
                title: (<TabTitleText>TabTitle</TabTitleText>),
                profile,
                rules: profile.rules
            }
        ));

        const wrapper = shallow(
            <TabbedRules tabsData={ tabsData } defaultProfileId={ profiles[1].id } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('passes handleSelect', () => {
        const profiles = policies.edges[0].node.policy.profiles;
        const tabsData =  profiles.map((profile) => (
            {
                title: (<TabTitleText>TabTitle</TabTitleText>),
                profile,
                rules: profile.rules
            }
        ));

        const wrapper = shallow(
            <TabbedRules tabsData={ tabsData } handleSelect={ function() {} } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
