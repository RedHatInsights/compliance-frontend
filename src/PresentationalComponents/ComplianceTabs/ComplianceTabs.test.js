import toJson from 'enzyme-to-json';
import { paths } from '../../Routes';

import { ComplianceTabs } from './ComplianceTabs';

describe('ComplianceTabs', () => {
    const defaultProps = {
        history: {},
        match: {
            path: paths.complianceSystems
        }
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <ComplianceTabs { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    // TODO: Add test triggering a click on a tab to test "redirect"
});
