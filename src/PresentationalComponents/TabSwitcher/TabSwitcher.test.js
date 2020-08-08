import TabSwitcher, { Tab } from './TabSwitcher';

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
