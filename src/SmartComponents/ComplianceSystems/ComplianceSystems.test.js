import { ComplianceSystems } from './ComplianceSystems.js';

describe('ComplianceSystems', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <ComplianceSystems />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
