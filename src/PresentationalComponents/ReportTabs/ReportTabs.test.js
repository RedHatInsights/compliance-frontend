import { ReportTabs } from './ReportTabs';

describe('ReportTabs', () => {
    const defaultProps = {
        history: {},
        match: {
            path: '/systems'
        }
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <ReportTabs { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
