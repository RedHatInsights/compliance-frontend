import { policies as rawPolicies  } from '@/__fixtures__/policies.js';
import ReportDetailsDescription from './ReportDetailsDescription';

const profiles = rawPolicies.edges.map((profile) => (profile.node));

describe('ReportDetailsDescription', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <ReportDetailsDescription profile={ profiles[0] } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
