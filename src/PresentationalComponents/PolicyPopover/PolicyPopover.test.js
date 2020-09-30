import PolicyPopover from './PolicyPopover';
import { policies } from '@/__fixtures__/policies.js';

describe('PolicyPopover', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <PolicyPopover profile={ policies.edges[0].node } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
