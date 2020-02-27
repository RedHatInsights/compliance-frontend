import toJson from 'enzyme-to-json';

import TabSwitcher, { Tab } from './TabSwitcher';

describe('TabSwitcher', () => {
    it('expect to render first tab', () => {
        const wrapper = shallow(
            <TabSwitcher activeTab={0}>
                <Tab tabId={0}>First Tab</Tab>
                <Tab tabId={1}>Second Tab</Tab>
            </TabSwitcher>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render second tab', () => {
        const wrapper = shallow(
            <TabSwitcher activeTab={1}>
                <Tab tabId={0}>First Tab</Tab>
                <Tab tabId={1}>Second Tab</Tab>
            </TabSwitcher>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
