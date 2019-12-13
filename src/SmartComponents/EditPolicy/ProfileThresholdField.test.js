import toJson from 'enzyme-to-json';

import { ProfileThresholdField } from './ProfileThresholdField';

describe('ProfileThresholdField', () => {
    const defaultProps = {
        previousThreshold: 10
    };
    it('expect to render without error', () => {
        const wrapper = shallow(
            <ProfileThresholdField { ...defaultProps }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
