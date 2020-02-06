import { init } from '../../store';
import logger from 'redux-logger';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';

jest.mock('@redhat-cloud-services/frontend-components-inventory-compliance', () =>
    () => 'Mocked ComplianceSystemDetails'
);

import { SystemsTable } from './SystemsTable';

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

describe('SystemsTable', () => {
    const store = init(logger).getStore();
    const client = { query: jest.fn(() => Promise.resolve(items)) };
    const defaultProps = { store, client };
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

    it('expect to render a loading state', () => {
        const component = renderer.create(
            <Provider store={defaultProps.store}>
                <SystemsTable/>
            </Provider>
        );

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('expect to not render a loading state', () => {
        const wrapper = shallow(
            <SystemsTable { ...defaultProps }  items={ items.data.allSystems } systemsCount= { 1 } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(global.insights.loadInventory).toHaveBeenCalled();
    });

    it('expect to set loading state correctly on systemfetch', async () => {
        const wrapper = shallow(
            <SystemsTable { ...defaultProps } />
        );
        const instance = wrapper.instance();
        instance.setState({
            loading: false,
            items: [],
            totalCount: 0
        });
        expect(instance.state.loading).toBe(false);
        expect(instance.state.totalCount).toBe(0);
        await wrapper.instance().systemFetch();
        expect(instance.state.loading).toBe(false);
        expect(instance.state.totalCount).toBe(1);
        expect(instance.state.items).toBe(items.data.systems.edges);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
