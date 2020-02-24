import toJson from 'enzyme-to-json';
import { paths } from '../../Routes';

import { ReportTabs } from './ReportTabs';

describe('ReportTabs', () => {
    const defaultProps = {
        history: {},
        match: {
            path: paths.complianceSystems
        }
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <ReportTabs { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
