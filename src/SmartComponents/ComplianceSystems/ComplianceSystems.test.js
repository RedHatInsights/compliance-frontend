import { ComplianceSystems } from './ComplianceSystems.js';

jest.mock('@apollo/react-hooks', () => ({
    useQuery: () => (
        { data: [], error: undefined, loading: undefined }
    )
}));

describe('ComplianceSystems', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <ComplianceSystems />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
