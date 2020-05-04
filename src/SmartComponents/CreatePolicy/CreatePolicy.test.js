import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { benchmarksQuery } from '@/__fixtures__/benchmarks_rules.js';

const mockStore = configureStore();
jest.mock('@apollo/react-hooks');

import CreatePolicy from './CreatePolicy.js';

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
        useQuery.mockImplementation(() => ({ data: { latestBenchmarks: benchmarksQuery }, error: false, loading: false }));
        const wrapper = mount(
            <Provider store={store}>
                <CreatePolicy isOpen />
            </Provider>
        );
        expect(toJson(wrapper.find('Wizard'))).toMatchSnapshot();
    });

    it('destroys the form on close', async () => {
        const wrapper = mount(
            <Provider store={store}>
                <CreatePolicy isOpen />
            </Provider>
        );
        await wrapper.find('button.pf-c-wizard__close').simulate('click');
        const lastAction = store.getActions().pop();
        expect(lastAction.type).toEqual('@@redux-form/DESTROY');
        expect(lastAction.meta.form).toEqual(['policyForm']);
    });
});
