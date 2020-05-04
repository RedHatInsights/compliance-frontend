import ReviewCreatedPolicy from './ReviewCreatedPolicy.js';
import configureStore from 'redux-mock-store';
import { policyFormValues } from '@/__fixtures__/benchmarks_rules.js';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';

const mockStore = configureStore();
jest.mock('@apollo/react-hooks');
jest.mock('../CreatePolicy/EditPolicyRules', () => {
    return <p>Systems table</p>;
});

describe('ReviewCreatedPolicy', () => {
    let store;
    let component;

    beforeEach(() => {
        store = mockStore({ form: { policyForm: { values: policyFormValues } } });
    });

    it('expect to render without error', () => {
        useQuery.mockImplementation(() => ({ data: {
            benchmark: {
                title: 'SCAP security guide for RHEL7',
                refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7',
                version: '0.1.40'  }
        }, error: false, loading: false }));
        component = renderer.create(
            <Provider store={store}>
                <ReviewCreatedPolicy />
            </Provider>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    it('should render a spinner while loading', () => {
        useQuery.mockImplementation(() => ({ data: {}, error: false, loading: true }));
        component = renderer.create(
            <Provider store={store}>
                <ReviewCreatedPolicy />
            </Provider>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });
});
