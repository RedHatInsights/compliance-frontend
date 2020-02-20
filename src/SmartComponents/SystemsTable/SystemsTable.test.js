import { init } from '../../store';
import logger from 'redux-logger';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';

jest.mock('@redhat-cloud-services/frontend-components-inventory-compliance', () =>
    () => <div />
);
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

        describe('#updateSearchFilter', () => {
            it('set search in state properly', () => {
                expect(wrapper.state().search).toMatchSnapshot();
                instance.updateSearchFilter('_event', 'SEARCH TERM');
                expect(wrapper.state().search).toMatchSnapshot();
            });
        });

        describe('#updateComplianceFilter', () => {
            it('set search in state properly', () => {
                expect(wrapper.state().activeFilters).toMatchSnapshot();
                instance.updateComplianceFilter('_event',
                    ['0-49', '50-69', '70-89', '90-100'], '70-89'
                );

                expect(wrapper.state().activeFilters).toMatchSnapshot();
            });
        });

        describe('#deleteSearchFilter', () => {
            it('set search in state properly', () => {
                instance.updateSearchFilter('_event', 'Search term');
                expect(wrapper.state()).toMatchSnapshot();
                const prevState = wrapper.state();
                instance.deleteSearchFilter();

                expect(wrapper.state()).not.toEqual(prevState);
                expect(wrapper.state()).toMatchSnapshot();
            });
        });

        describe('#deleteComplianceFilter', () => {
            beforeEach(() => {
                instance.clearAllFilter();
            });

            it('set search in state properly', () => {
                instance.updateComplianceFilter('_event',
                    ['0-49', '50-69', '70-89', '90-100'], '70-89'
                );
                expect(wrapper.state()).toMatchSnapshot();
                const prevState = wrapper.state();
                instance.deleteComplianceFilter({
                    category: 'complianceScores',
                    chips: [
                        { name: '70-89' }
                    ]
                });

                expect(wrapper.state()).not.toEqual(prevState);
                expect(wrapper.state()).toMatchSnapshot();
            });

            it('set search in state properly', () => {
                instance.updateComplianceFilter('_event',
                    ['false']
                );
                expect(wrapper.state()).toMatchSnapshot();
                const prevState = wrapper.state();
                instance.deleteComplianceFilter({
                    category: 'Compliant',
                    chips: [
                        { name: 'Non-compliant' }
                    ]
                });

                expect(wrapper.state()).not.toEqual(prevState);
                expect(wrapper.state()).toMatchSnapshot();
            });
        });
    });
});
