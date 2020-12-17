import ReportCardGrid from './ReportCardGrid';

import { policies as rawPolicies  } from '@/__fixtures__/policies.js';
const profiles = rawPolicies.edges.map((policy) => (policy.node));

describe('ReportCardGrid', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <ReportCardGrid { ...{ profiles } } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
