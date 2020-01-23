import toJson from 'enzyme-to-json';
import { PoliciesTable } from './PoliciesTable.js';
import { policies } from './fixtures.js';
import debounce from 'lodash/debounce';

jest.mock('lodash/debounce');
jest.mock('@apollo/react-hooks');
debounce.mockImplementation(fn => fn);
jest.mock('../CreatePolicy/EditPolicyRules', () => {
    return <p>Rules table</p>;
});

describe('PoliciesTable', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <PoliciesTable policies={policies.edges.map(profile => profile.node)} />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render emptystate', () => {
        const wrapper = shallow(
            <PoliciesTable policies={[]} />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('Pagination and search', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallow(
                <PoliciesTable
                    policies={policies.edges.map(profile => profile.node)}
                />);
        });

        it('should show only matching results after searching', async () => {
            const searchResults = [
                {
                    cells: [
                        'Red Hat Corporate Profile for Certified Cloud Providers (RH CCP)',
                        'External',
                        null,
                        100
                    ]
                }
            ];

            const instance = wrapper.instance();
            await instance.handleSearch('CCP');
            expect(wrapper.state('currentRows')).toEqual(searchResults);
        });

        it('should be able to move to next and previous pages', async () => {
            const firstPage = [
                {
                    cells: [
                        'United States Government Configuration Baseline23',
                        'External',
                        null,
                        100
                    ]
                },
                {
                    cells: [
                        'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 73',
                        'External',
                        null,
                        67
                    ]
                },
                {
                    cells: [
                        'United States Government Configuration Baseline2',
                        'External',
                        null,
                        100
                    ]
                },
                {
                    cells: [
                        'C2S for Red Hat Enterprise Linux 7',
                        'External',
                        null,
                        69.5
                    ]
                },
                {
                    cells: [
                        'Criminal Justice Information Services (CJIS) Security Policy',
                        'External',
                        null,
                        100
                    ]
                },
                {
                    cells: [
                        'Unclassified Information in Non-federal Information Systems and Organizations (NIST 800-171)',
                        'External',
                        null,
                        100
                    ]
                },
                {
                    cells: [
                        'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
                        'External',
                        null,
                        100
                    ]
                },
                {
                    cells: [
                        'Red Hat Corporate Profile for Certified Cloud Providers (RH CCP)',
                        'External',
                        null,
                        100
                    ]
                },
                {
                    cells: [
                        'Health Insurance Portability and Accountability Act (HIPAA)',
                        'External',
                        null,
                        100
                    ]
                },
                {
                    cells: [
                        'United States Government Configuration Baseline',
                        'External',
                        null,
                        100
                    ]
                }
            ];
            const secondPage = [
                { cells: [
                    'Standard System Security Profile for Red Hat Enterprise Linux 7',
                    'External',
                    null,
                    100
                ] },
                { cells: [
                    'DISA STIG for Red Hat Enterprise Linux 7',
                    'External',
                    null,
                    100
                ] },
                { cells: [
                    'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 72',
                    'External',
                    null,
                    100
                ] }
            ];

            const instance = wrapper.instance();
            await instance.changePage(2, 10);
            expect(wrapper.state('currentRows')).toEqual(secondPage);
            await instance.changePage(1, 10);
            expect(wrapper.state('currentRows')).toEqual(firstPage);
        });
    });
});
