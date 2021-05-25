import ReviewCreatedPolicy from './ReviewCreatedPolicy.js';
import configureStore from 'redux-mock-store';
import { policyFormValues } from '@/__fixtures__/benchmarks_rules.js';
import { Provider } from 'react-redux';
import { useQuery } from '@apollo/client';

const mockStore = configureStore();
jest.mock('@apollo/client');

describe('ReviewCreatedPolicy', () => {
    let store;
    let component;

    beforeEach(() => {
        store = mockStore({
            form: {
                policyForm: {
                    values: {
                        osMinorVersionCounts: [
                            {
                                osMinorVersion: 7,
                                count: 10
                            },
                            {
                                osMinorVersion: 5,
                                count: 3
                            }
                        ],
                        ...policyFormValues
                    }
                }
            },
            entities: {
                systems: [
                    {
                        node: {
                            osMinorVersion: 2
                        }
                    },
                    {
                        node: {
                            osMinorVersion: 1
                        }
                    },
                    {
                        node: {
                            osMinorVersion: 1
                        }
                    }
                ]
            }
        });
    });

    it('expect to render without error', () => {
        useQuery.mockImplementation(() => ({ data: {
            benchmark: {
                title: 'SCAP security guide for RHEL7',
                refId: 'xccdf_org.ssgproject.content_benchmark_RHEL-7',
                osMajorVersion: '7',
                version: '0.1.40'  }
        }, error: false, loading: false }));
        component = mount(
            <Provider store={store}>
                <ReviewCreatedPolicy />
            </Provider>
        );
        expect(toJson(component)).toMatchSnapshot();
    });

    it('should render a spinner while loading', () => {
        useQuery.mockImplementation(() => ({ data: {}, error: false, loading: true }));
        component = mount(
            <Provider store={store}>
                <ReviewCreatedPolicy />
            </Provider>
        );
        expect(toJson(component)).toMatchSnapshot();
    });
});
