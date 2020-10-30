import PolicyMultiversionRules from './PolicyMultiversionRules';
import { policies } from '@/__fixtures__/policies';

describe('PolicyMultiversionRules', () => {
    it('expect to render without error', () => {
        const policy = policies.edges[0].node;
        const wrapper = shallow(
            <PolicyMultiversionRules { ...{ policy } } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
