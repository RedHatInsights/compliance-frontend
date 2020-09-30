import { policies as rawPolicies  } from '@/__fixtures__/policies.js';
import ReportsTable from './ReportsTable';

const profiles = rawPolicies.edges.map((profile) => (profile.node));

describe('ReportsTable', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <ReportsTable profiles={ profiles } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
