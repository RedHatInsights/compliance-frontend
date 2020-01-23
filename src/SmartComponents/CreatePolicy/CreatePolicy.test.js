import CreatePolicy from './CreatePolicy.js';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { benchmarksQuery } from './fixtures.js';

const mockStore = configureStore();
jest.mock('@apollo/react-hooks');
jest.mock('../CreatePolicy/EditPolicyRules', () => {
    return <p>Rules table</p>;
});

describe('CreatePolicy', () => {
    let store;
    let component;

    beforeEach(() => {
        store = mockStore({});
    });

    it('expect to render the create button', () => {
        component = renderer.create(
            <Provider store={store}>
                <CreatePolicy />
            </Provider>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    it('expect to render the wizard', async () => {
        useQuery.mockImplementation(() => ({ data: { allBenchmarks: benchmarksQuery }, error: false, loading: false }));
        const wrapper = mount(
            <Provider store={store}>
                <CreatePolicy isOpen />
            </Provider>
        );
        expect(toJson(wrapper.find('Wizard'))).toMatchSnapshot();
    });
});
