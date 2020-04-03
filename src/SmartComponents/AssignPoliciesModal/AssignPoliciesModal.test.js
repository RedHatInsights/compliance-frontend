import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useQuery, useMutation } from '@apollo/react-hooks';

const mockStore = configureStore();
jest.mock('@apollo/react-hooks');
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
                                    name: 'profile1'
                                }
                            ]
                        }
                    ]
                },
                profiles: {
                    nodes: [{
                        id: '1',
                        name: 'profile1'
                    }]
                }
            }, error: false, loading: false }));
    });

    it('expect to render an open modal without error', () => {

        const component = mount(
            <Provider store={store}>
                <AssignPoliciesModal { ...defaultProps } isModalOpen={true} />
            </Provider>
        );

        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect not to render anything for a closed modal', () => {
        const component = mount(
            <Provider store={store}>
                <AssignPoliciesModal { ...defaultProps } isModalOpen={ false } />
            </Provider>
        );

        expect(toJson(component)).toMatchSnapshot();
    });
});
