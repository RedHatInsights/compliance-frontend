import { init } from 'Store';
import { Provider } from 'react-redux';
import ReactDom from 'react-dom';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import {
    QUERY,
    PolicyDetailsQuery,
    PolicyDetails
} from './PolicyDetails';

const mocks = [
    {
        request: {
            query: QUERY,
            variables: {
                policyId: '1234'
            }
        },
        result: {
            data: {
                profile: {
                    id: '1',
                    refId: '121212',
                    name: 'profile1',
                    description: 'profile description',
                    totalHostCount: 1,
                    complianceThreshold: 1,
                    compliantHostCount: 1,
                    policy: {
                        name: 'parentpolicy'
                    },
                    businessObjective: {
                        id: '1',
                        title: 'BO 1'
                    },
                    benchmark: {
                        title: 'benchmark',
                        version: '0.1.5'
                    }
                }
            }
        }
    }
];
const store = init().getStore();

jest.mock('../EditPolicy/EditPolicy', () => {
    const EditPolicy = () => <div>Edit Policy</div>;
    return EditPolicy;
});

// Currently there seems to be an issue in react-apollo, which causes it not to recognize a MockProvider
// This is a hack and should eventually be replaced by using a MockProvider provided by react-apollo's test utilities
jest.mock('@apollo/react-hooks', () => ({
    useQuery: () => {
        return { data: mocks[0].result.data, error: false, loading: false };
    }
}));

describe('PolicyDetailsQuery', () => {
    const MockComponent = jest.fn(({ children, loaded }) => {
        return children && loaded ? children : 'Test Loading...';
    });
    const defaultProps = {
        store,
        policyId: '1234',
        onNavigateWithProps: jest.fn()
    };
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        global.insights = {
            chrome: { isBeta: jest.fn(() => true) },
            loadInventory: jest.fn(() => {
                return Promise.resolve({
                    inventoryConnector: () => ({
                        InventoryTable: MockComponent
                    }),
                    INVENTORY_ACTION_TYPES: {},
                    mergeWithEntities: () => ({})
                });
            })
        };
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it('expect to render even without policyId', () => {
        act(() => {
            ReactDom.render(
                <Router>
                    <Provider store={ store }>
                        <PolicyDetailsQuery />
                    </Provider>
                </Router>, container);
        });

        expect(container).toMatchSnapshot();
    });

    it('renders without error', () => {
        act(() => {
            ReactDom.render(
                <Router>
                    <Provider store={ store }>
                        <PolicyDetailsQuery policyId="1234" />
                    </Provider>
                </Router>, container);
        });

        expect(container).toMatchSnapshot();
    });

    it('renders without error', () => {
        act(() => {
            ReactDom.render(
                <Router>
                    <Provider store={ store }>
                        <PolicyDetailsQuery policyId="1234" />
                    </Provider>
                </Router>, container);
        });

        expect(container).toMatchSnapshot();
    });

    it('expect to render with policyId', () => {
        act(() => {
            ReactDom.render(
                <Router>
                    <Provider store={ store }>
                        <PolicyDetailsQuery { ...defaultProps } />
                    </Provider>
                </Router>, container);
        });

        expect(container).toMatchSnapshot();
    });
});

describe('PolicyDetails', () => {
    const defaultProps = {
        match: {
            params: {
                policyId: '123'
            }
        }
    };
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it('expect to render without error', () => {
        act(() => {
            ReactDom.render(
                <Router>
                    <Provider store={ store }>
                        <PolicyDetails { ...defaultProps } />
                    </Provider>
                </Router>, container);
        });

        expect(container).toMatchSnapshot();
    });
});
