import { policyFormValues } from '@/__fixtures__/benchmarks_rules.js';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { Provider as ReduxProvider } from 'react-redux';

const mockStore = configureStore();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        pathname: ''
    })
}));

import EditPolicySystems from './EditPolicySystems.js';

describe('EditPolicySystems', () => {
    let store;
    let component;
    const MockComponent = jest.fn(({ children, loaded }) => {
        return children && loaded ? children : 'Loading...';
    });
    beforeEach(() => {
        store = mockStore({ form: { policyForm: { values: policyFormValues } } });
        global.insights = {
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

    it('expect to render without error', async () => {
        component = await renderer.create(
            <ReduxProvider store={store}>
                <MockedProvider>
                    <EditPolicySystems />
                </MockedProvider>
            </ReduxProvider>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });
});
