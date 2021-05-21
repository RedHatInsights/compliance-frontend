import { policies } from '@/__fixtures__/policies';

import RulesTable from './RulesTable';

describe('RulesTable', () => {
    it('expect to render without error', () => {
        const profile = policies.edges[0].node.policy.profiles;

        let wrapper = shallow(
            <RulesTable profileRules={ profile } system={ { id: 1 } } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
