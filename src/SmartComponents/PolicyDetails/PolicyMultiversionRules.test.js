import PolicyMultiversionRules from './PolicyMultiversionRules';
import { policies } from '@/__fixtures__/policies';

describe('PolicyMultiversionRules', () => {
    it('expect to render without error', () => {
        const hosts = [
            { osMinorVersion: '9' },
            { osMinorVersion: '9' },
            { osMinorVersion: '8' },
            { osMinorVersion: '999' }
        ];
        const policy = {
            ...policies.edges[0].node,
            hosts
        };
        const wrapper = shallow(
            <PolicyMultiversionRules policy={ policy } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
