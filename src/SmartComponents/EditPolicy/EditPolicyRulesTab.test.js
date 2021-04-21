import { useQuery } from '@apollo/client';
import { policies } from '@/__fixtures__/policies.js';
import EditPolicyRulesTab, { toTabsData } from './EditPolicyRulesTab.js';

jest.mock('@apollo/client');
const policy = policies.edges[0].node;

describe('EditPolicyRulesTab', () => {
    useQuery.mockImplementation(() => ({
        data: {
            benchmarks: {
                edges: [{
                    id: '1',
                    osMajorVersion: '7',
                    rules: policy.rules
                }]
            }
        }, error: undefined, loading: undefined
    }));

    it('expect to render without error', () => {
        const wrapper = shallow(
            <EditPolicyRulesTab
                handleSelect={ () => {} }
                policy={ { policy: policies.edges[0].node  } }
                selectedRuleRefIds={ [] }
                osMinorVersionCounts={ {} }
            />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render with policy passed', () => {
        const wrapper = shallow(
            <EditPolicyRulesTab
                handleSelect={ () => {} }
                policy={ policies.edges[0].node }
                selectedRuleRefIds={ [] }
                osMinorVersionCounts={ {
                    9: {
                        osMinorVersion: 9, count: 1
                    }
                } }
            />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('.toTabsData', () => {
    it('expect to render without error', async () => {
        const policy = policies.edges[0].node;
        const osMinorVersionCounts = {
            9: {
                osMinorVersion: 9,
                count: 1
            }
        };
        const benchmark = {
            latestSupportedOsMinorVersions: [9],
            profiles: [
                { refId: policy.refId }
            ]
        };
        const result = toTabsData(policy, osMinorVersionCounts, [benchmark], []);
        expect(result).toMatchSnapshot();
    });
});
