import TabbedRules from './TabbedRules';
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
        const tabsData =  profiles.map((profile) => ({ profile }));

        const wrapper = shallow(
            <TabbedRules tabsData={ tabsData } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders tabs with second item as default', () => {
        const profiles = policies.edges[0].node.policy.profiles;
        const tabsData =  profiles.map((profile) => ({ profile }));

        const wrapper = shallow(
            <TabbedRules tabsData={ tabsData } defaultProfileId={ profiles[1].id } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('passes handleSelect', () => {
        const profiles = policies.edges[0].node.policy.profiles;
        const tabsData =  profiles.map((profile) => ({ profile }));

        const wrapper = shallow(
            <TabbedRules tabsData={ tabsData } handleSelect={ function() {} } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
