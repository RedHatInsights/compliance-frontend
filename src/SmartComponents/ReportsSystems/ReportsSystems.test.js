import toJson from 'enzyme-to-json';
import ReportsSystems from './ReportsSystems.js';

describe('ReportsSystems', () => {
    it('expect to render without error in beta', () => {
        window.insights = {
            chrome: { isBeta: jest.fn(() => true) }
        };

        const wrapper = shallow(
            <ReportsSystems />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render without error in stable', () => {
        window.insights = {
            chrome: { isBeta: jest.fn(() => false) }
        };

        const wrapper = shallow(
            <ReportsSystems />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
