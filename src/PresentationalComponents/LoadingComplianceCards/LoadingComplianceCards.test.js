import toJson from 'enzyme-to-json';

import LoadingComplianceCards from './LoadingComplianceCards';

describe('LoadingComplianceCards', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <LoadingComplianceCards />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
