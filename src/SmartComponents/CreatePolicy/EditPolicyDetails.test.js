import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { policyFormValues } from '@/__fixtures__/benchmarks_rules.js';

import { EditPolicyDetails } from './EditPolicyDetails.js';

const mockStore = configureStore();
const store = mockStore({});
jest.mock('redux-form', () => ({
    Field: 'Field',
    reduxForm: () => component => component,
    formValueSelector: () => () => (''),
    propTypes: {
        change: jest.fn()
    }
}));

describe('EditPolicyDetails', () => {
    it('expect to render without error', () => {
        const component = mount(
            <Provider store={ store }>
                <EditPolicyDetails profile={JSON.parse(policyFormValues.profile)}/>
            </Provider>
        );
        expect(toJson(component)).toMatchSnapshot();
    });
});
