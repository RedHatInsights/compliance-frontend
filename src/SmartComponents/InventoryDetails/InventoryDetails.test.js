import InventoryDetails from './InventoryDetails';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

const MockComponent = jest.fn(({ children, loaded }) => {
    return children && loaded ? children : 'Loading...';
});

const mockStore = configureStore();

describe('InventoryDetails', () => {
    const defaultProps = {

    };

    beforeEach(() => {
        global.insights = {
            loadInventory: jest.fn(() => {
                return Promise.resolve({
                    inventoryConnector: () => ({
                        InventoryDetails: MockComponent
                    }),
                    INVENTORY_ACTION_TYPES: {},
                    mergeWithEntities: () => ({})
                });
            })
        };
    });

    it('expect to render without error', () => {
        const wrapper = mount(
            <Provider store={mockStore()}>
                <InventoryDetails { ...defaultProps }/>
            </Provider>
        );

        expect(toJson(wrapper.find('InventoryCmp'), { mode: 'shallow' })).toMatchSnapshot();
    });
});
