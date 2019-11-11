import { init } from '../../store';
import logger from 'redux-logger';
import toJson from 'enzyme-to-json';

import { SystemsTable } from './SystemsTable';

jest.doMock('../ComplianceRemediationButton/ComplianceRemediationButton', () => {
    const ComplianceRemediationButton = () => <button>Remediations</button>;
    return ComplianceRemediationButton;
});

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
        const wrapper = shallow(
            <SystemsTable { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(global.insights.loadInventory).toHaveBeenCalled();
    });

    it('expect to not render a loading state', () => {
        const wrapper = shallow(
            <SystemsTable { ...defaultProps } loading={ false } items={ items.data.allSystems } systemsCount= { 1 } />
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
            totalItems: 0
        });
        expect(instance.state.loading).toBe(false);
        expect(instance.state.totalItems).toBe(0);
        await wrapper.instance().systemFetch();
        expect(instance.state.loading).toBe(false);
        expect(instance.state.totalItems).toBe(1);
        expect(instance.state.items).toBe(items.data.systems.edges);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
