import EditPolicySystemsTab from './EditPolicySystemsTab.js';

describe('EditPolicySystemsTab', () => {
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

    it('expect to render without error', async () => {
        const wrapper = shallow(
            <EditPolicySystemsTab />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
