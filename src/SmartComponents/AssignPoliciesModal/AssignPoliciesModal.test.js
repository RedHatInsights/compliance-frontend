import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';
import { useQuery, useMutation } from '@apollo/react-hooks';

const waitForComponentToPaint = async (wrapper: any) => {
    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
        wrapper.update();
    });
};

const mockStore = configureStore();
jest.mock('@apollo/react-hooks');
jest.mock('Utilities/InventoryApi', () => (
    {
        /* eslint-disable camelcase */
        getSystemProfile: () => Promise.resolve({ results: [{ system_profile: { os_release: '8.1' } }] })
        /* eslint-enable camelcase */
    }
));
jest.mock('../CreatePolicy/EditPolicyRules', () => {
    return <p>Rules table</p>;
});
jest.mock('@redhat-cloud-services/frontend-components-inventory-compliance', () => {
    const ComplianceRemediationButton = () => <button>Remediations</button>;
    return ComplianceRemediationButton;
});

import AssignPoliciesModal from './AssignPoliciesModal.js';

describe('AssignPoliciesModal', () => {
    const defaultProps = {
        fqdn: 'myhost',
        id: '1',
        toggle: jest.fn()
    };

    let store;
    beforeEach(() => {
        store = mockStore({ form: { policyForm: {
            values: { policies: ['1', '2'] }
        } } });

        useMutation.mockImplementation((query, options) => {
            return [function() {
                options.onCompleted();
            }];
        });
    });

    it('expect to render an open modal without error', async () => {
        useQuery.mockImplementation(() => ({
            data: {
                systems: {
                    nodes: [
                        {
                            id: '1',
                            fqdn: 'myhost',
                            profiles: [
                                {
                                    id: '1',
                                    name: 'profile1',
                                    majorOsVersion: '8'
                                }
                            ]
                        }
                    ]
                },
                profiles: {
                    nodes: [{
                        id: '1',
                        name: 'profile1',
                        majorOsVersion: '8'
                    }, {
                        id: '2',
                        name: 'profile2',
                        majorOsVersion: '7'
                    }]
                }
            }, error: false, loading: false }));

        const component = mount(
            <Provider store={store}>
                <AssignPoliciesModal { ...defaultProps } isModalOpen={ true } />
            </Provider>
        );
        await waitForComponentToPaint(component);
        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect not to render anything for a closed modal', async () => {
        useQuery.mockImplementation(() => ({
            data: {
                systems: {
                    nodes: [
                        {
                            id: '1',
                            fqdn: 'myhost',
                            profiles: [
                                {
                                    id: '1',
                                    name: 'profile1',
                                    majorOsVersion: '8'
                                }
                            ]
                        }
                    ]
                },
                profiles: {
                    nodes: [{
                        id: '1',
                        name: 'profile1',
                        majorOsVersion: '8'
                    }]
                }
            }, error: false, loading: false }));

        const component = mount(
            <Provider store={store}>
                <AssignPoliciesModal { ...defaultProps } isModalOpen={ false } />
            </Provider>
        );
        await waitForComponentToPaint(component);
        expect(toJson(component)).toMatchSnapshot();
    });

    it('renders empty state if no OS is matching the system', async () => {
        useQuery.mockImplementation(() => ({
            data: {
                systems: {
                    nodes: [
                        {
                            id: '1',
                            fqdn: 'myhost'
                        }
                    ]
                },
                profiles: {
                    nodes: [{
                        id: '1',
                        name: 'profile1',
                        majorOsVersion: '7'
                    }, {
                        id: '2',
                        name: 'profile2',
                        majorOsVersion: '7'
                    }]
                }
            }, error: false, loading: false }));

        const component = mount(
            <Provider store={store}>
                <AssignPoliciesModal { ...defaultProps } isModalOpen={ open } />
            </Provider>
        );
        await waitForComponentToPaint(component);
        expect(toJson(component)).toMatchSnapshot();
    });
});
