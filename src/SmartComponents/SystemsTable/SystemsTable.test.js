import { init } from '../../store';
import logger from 'redux-logger';
import toJson from 'enzyme-to-json';

const mockExportJsonFunction = jest.fn();
jest.mock('Utilities/Export', () => ({
    exportToJson: () => mockExportJsonFunction()
}));

// We mock the debounce function otherwise we'd have to deal with time.
import debounce from 'lodash/debounce';
jest.mock('lodash/debounce');
debounce.mockImplementation(fn => fn);
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
        const component = shallow(
            <SystemsTable />
        );

        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect to not render a loading state', () => {
        const wrapper = shallow(
            <SystemsTable { ...defaultProps } items={ items.data.systems } entityCount= { 1 } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(global.insights.loadInventory).toHaveBeenCalled();
    });

    it('expect to not show actions if showActions is false', () => {
        const wrapper = shallow(
            <SystemsTable { ...defaultProps } showActions={false} items={ items.data.systems } entityCount= { 1 } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(global.insights.loadInventory).toHaveBeenCalled();
    });

    it('expect to show actions if showActions is true or by default', () => {
        const wrapper = shallow(
            <SystemsTable { ...defaultProps } items={ items.data.systems } entityCount= { 1 } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(global.insights.loadInventory).toHaveBeenCalled();
    });

    it('expect to set compliant filters when enabled', () => {
        const wrapper = shallow(
            <SystemsTable { ...defaultProps }
                items={ items.data.systems }
                entityCount= { 1 }
                compliantFilter={ true } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to set isDisable on export config to true entityCount is 0', () => {
        const wrapper = shallow(
            <SystemsTable { ...defaultProps }
                items={ items.data.systems }
                entityCount= { 0 } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to set isDisable on export config to false entityCount is 0 but selected is not', () => {
        const wrapper = shallow(
            <SystemsTable { ...defaultProps }
                items={ items.data.systems }
                entityCount= { 0 }
                selectedEntities={ 1 } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
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

    describe('Instance functions', () => {
        const exportCsvFunction = jest.fn();
        let wrapper;
        let instance;

        beforeEach(() =>{
            wrapper = shallow(
                <SystemsTable { ...defaultProps } exportToCSV={ exportCsvFunction } />
            );
            instance = wrapper.instance();
        });

        describe('#onExportSelect', () => {
            it('expect to dispatch calls to export functions per arguments', () => {
                instance.onExportSelect('_event', 'csv');
                expect(exportCsvFunction).toHaveBeenCalled();

                instance.onExportSelect('_event', 'json');
                expect(mockExportJsonFunction).toHaveBeenCalled();
            });
        });

        describe('#onFilterUpdate', () => {
            it('set search in state properly', () => {
                expect(wrapper.state().activeFilters).toMatchSnapshot();
                instance.onFilterUpdate('name', 'SEARCH TERM');
                expect(wrapper.state().activeFilters).toMatchSnapshot();
            });

            it('set search in state properly', () => {
                expect(wrapper.state().activeFilters).toMatchSnapshot();
                instance.onFilterUpdate('compliancescore',
                    ['0-49', '50-69', '90-100']
                );

                expect(wrapper.state().activeFilters).toMatchSnapshot();
            });
        });

        describe('#deleteFilter', () => {
            beforeEach(() => {
                instance.clearAllFilter();
            });

            it('set search in state properly', () => {
                instance.onFilterUpdate('compliancescore',
                    ['0-49', '50-69', '70-89', '90-100']
                );
                const prevState = wrapper.state().activeFilters;
                expect(prevState).toMatchSnapshot();
                instance.deleteFilter({
                    category: 'Compliance score',
                    chips: [
                        { name: '70 - 89%' }
                    ]
                });

                expect(wrapper.state()).not.toEqual(prevState);
                expect(wrapper.state().activeFilters).toMatchSnapshot();
            });

            it('set search in state properly', () => {
                instance.onFilterUpdate('compliant',
                    ['false']
                );
                const prevState = wrapper.state().activeFilters;
                expect(prevState).toMatchSnapshot();
                instance.deleteFilter({
                    category: 'Compliant',
                    chips: [
                        { name: 'Non-compliant' }
                    ]
                });

                expect(wrapper.state()).not.toEqual(prevState);
                expect(wrapper.state().activeFilters).toMatchSnapshot();
            });
        });
    });
});
