import { policyFormValues } from './fixtures.js';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';

const mockStore = configureStore();

import EditPolicySystems from './EditPolicySystems.js';

describe('EditPolicySystems', () => {
    let store;
    let component;

    beforeEach(() => {
        store = mockStore({ form: { policyForm: { values: policyFormValues } } });
    });

    it('expect to render without error', () => {
        component = renderer.create(
            <MockedProvider>
                <EditPolicySystems store={store} />
            </MockedProvider>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });
});
