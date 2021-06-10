import { policies } from '@/__fixtures__/policies';

import RulesTable from './RulesTable';

describe('RulesTable', () => {
    const profiles = policies.edges[0].node.policy.profiles;
    const defaultProps = {
        profileRules: profiles,
        system: {
            id: 1
        }
    };

    it('expect to render without error', () => {
        let wrapper = shallow(
            <RulesTable { ...defaultProps } />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to pass on options', () => {
        let wrapper = shallow(
            <RulesTable { ...{
                ...defaultProps,
                options: {
                    additionalTableToolsOption: true
                }
            } } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
