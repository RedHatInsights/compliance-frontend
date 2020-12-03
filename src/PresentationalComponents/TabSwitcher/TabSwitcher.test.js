import TabSwitcher, { ContentTab, RoutedTabSwitcher, RoutedTabs } from './TabSwitcher';
import { Tab } from '@patternfly/react-core';

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

describe('TabSwitcher', () => {
    it('expect to render first tab', () => {
        const wrapper = shallow(
            <TabSwitcher activeKey={0}>
                <Tab eventKey={0}>First Tab</Tab>
                <Tab tabId={1}>Second Tab</Tab>
            </TabSwitcher>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render second tab', () => {
        const wrapper = shallow(
            <TabSwitcher activeKey={1}>
                <Tab eventKey={0}>First Tab</Tab>
                <Tab eventKey={1}>Second Tab</Tab>
            </TabSwitcher>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('TabSwitcher', () => {
    it('expect to render first tab', () => {
        const wrapper = shallow(
            <RoutedTabSwitcher defaultTab='system'>
                <ContentTab eventKey='details'>
                    DETAILS
                </ContentTab>
                <ContentTab eventKey='rules'>
                    RULES
                </ContentTab>
                <ContentTab eventKey='systems'>
                    SYSTEMS
                </ContentTab>
            </RoutedTabSwitcher>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render second tab', () => {
        const wrapper = shallow(
            <TabSwitcher activeKey={1}>
                <Tab eventKey={0}>First Tab</Tab>
                <Tab eventKey={1}>Second Tab</Tab>
            </TabSwitcher>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('RoutedTabs', () => {
    it('expect to render first tab', () => {
        const wrapper = shallow(
            <RoutedTabs defaultTab='rules'>
                <Tab title='Details' id='policy-details' eventKey='details' />
                <Tab title='Rules' id='policy-rules' eventKey='rules' />
                <Tab title='Systems' id='policy-systems' eventKey='systems' />
            </RoutedTabs>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render second tab', () => {
        const wrapper = shallow(
            <RoutedTabs activeKey='systems' defaultTab='rules'>
                <Tab title='Details' id='policy-details' eventKey='details' />
                <Tab title='Rules' id='policy-rules' eventKey='rules' />
                <Tab title='Systems' id='policy-systems' eventKey='systems' />
            </RoutedTabs>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
