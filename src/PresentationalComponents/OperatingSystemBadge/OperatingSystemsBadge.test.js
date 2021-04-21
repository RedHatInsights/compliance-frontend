import OperatingSystemBadge from './OperatingSystemBadge';

describe('OperatingSystemBadge', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <OperatingSystemBadge />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render with majorOsVersion given', () => {
        const wrapper = shallow(
            <OperatingSystemBadge majorOsVersion="7" />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
