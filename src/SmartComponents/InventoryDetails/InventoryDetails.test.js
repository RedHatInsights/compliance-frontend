import InventoryDetails from './InventoryDetails';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';

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
        const store = mockStore();
        const wrapper = mount(
            <Provider store={store}>
                <InventoryDetails { ...defaultProps }/>
            </Provider>
        );

        expect(toJson(wrapper.find('InventoryCmp'), { mode: 'shallow' })).toMatchSnapshot();
    });
});
