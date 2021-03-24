import { init } from 'Store';
import logger from 'redux-logger';
import { useSelector } from 'react-redux';

import { InventoryTable } from './InventoryTable';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useStore: jest.fn(),
    useDispatch: jest.fn()
}));

const items = {
    data: {
        systems: {
            totalCount: 1,
            edges: [
                {
                    node: {
                        id: 1
                    }
                }
            ]
        }
    }
};

describe('InventoryTable', () => {
    const store = init(logger).getStore();
    const client = { query: jest.fn(() => Promise.resolve(items)) };
    const updateSystemsFunction = jest.fn(jest.fn(() => Promise.resolve(items)));
    const updateRowsFunction = jest.fn(jest.fn(() => Promise.resolve(items)));
    const defaultProps = {
        store,
        client,
        updateSystems: updateSystemsFunction,
        updateRows: updateRowsFunction,
        clearInventoryFilter: jest.fn(),
        titleComponent: 'Title Component',
        emptyStateComponent: 'Empty State Component'
    };
    const MockComponent = jest.fn(({ children, loaded }) => {
        return children && loaded ? children : 'Loading...';
    });

    beforeEach(() => {
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

    it('expect to not render a loading state', () => {
        const state = {
            entities: {
                selectedEntities: []
            }
        };
        useSelector.mockImplementation((callback) => (callback(state)));
        const wrapper = shallow(
            <InventoryTable { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
