import CreateSCAPPolicy from './CreateSCAPPolicy.js';
import configureStore from 'redux-mock-store';
import { useQuery } from '@apollo/react-hooks';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { benchmarksQuery, profileRefIdsQuery } from '@/__fixtures__/benchmarks_rules.js';

const mockStore = configureStore();
jest.mock('@apollo/react-hooks');

describe('CreateSCAPPolicy', () => {
    let store;
    let component;

    beforeEach(() => {
        store = mockStore({});
    });

    it('expect to render without error', () => {
        useQuery.mockImplementation(() => ({ data: {}, error: false, loading: false }));
        component = renderer.create(
            <Provider store={store}>
                <CreateSCAPPolicy />
            </Provider>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    it('should render a spinner while loading', () => {
        useQuery.mockImplementation(() => ({ data: {}, error: false, loading: true }));
        component = renderer.create(
            <Provider store={store}>
                <CreateSCAPPolicy />
            </Provider>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    it('should render benchmarks and no policies until one is selected', () => {
        useQuery.mockImplementation(() => ({ data: { latestBenchmarks: benchmarksQuery }, error: false, loading: false }));
        component = renderer.create(
            <Provider store={store}>
                <CreateSCAPPolicy />
            </Provider>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    it('should render policies from the selected benchmark only', () => {
        store = mockStore({ form: { policyForm: {
            values: { benchmark: benchmarksQuery[0].id }
        } } });
        useQuery.mockImplementation(() => ({
            data: { latestBenchmarks: benchmarksQuery, profiles: profileRefIdsQuery }, error: false, loading: false
        }));
        const wrapper = mount(
            <Provider store={store}>
                <CreateSCAPPolicy />
            </Provider>
        );
        expect(toJson(wrapper.find('Button'), { mode: 'deep' })).toMatchSnapshot();
        expect(toJson(wrapper.find('ProfileTypeSelect'), { mode: 'shallow' })).toMatchSnapshot();
    });
});
