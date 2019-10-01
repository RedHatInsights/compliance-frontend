import toJson from 'enzyme-to-json';

import LoadingPoliciesTable from './LoadingPoliciesTable';

describe('LoadingPoliciesTable', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <LoadingPoliciesTable />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
