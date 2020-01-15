import toJson from 'enzyme-to-json';
import EditPolicyDetails from './EditPolicyDetails.js';
import configureStore from 'redux-mock-store';
import { policyFormValues } from './fixtures.js';

const mockStore = configureStore();
jest.mock('@apollo/react-hooks');
jest.mock('../CreatePolicy/EditPolicyRules', () => {
    return <p>Details table</p>;
});

describe('EditPolicyDetails', () => {
    let store;
    let EditPolicyDetailsWrapper;
    let EditPolicyDetailsComponent;

    beforeEach(() => {
        store = mockStore({ form: { policyForm: { values: policyFormValues } } });
        /* eslint-disable react/display-name */
        EditPolicyDetailsWrapper = (props) => (
            <EditPolicyDetails {...props} store={store} />
        );
        /* eslint-enable react/display-name */
        EditPolicyDetailsComponent = shallow(<EditPolicyDetailsWrapper />).dive();
    });

    it('expect to render without error', () => {
        expect(toJson(EditPolicyDetailsComponent)).toMatchSnapshot();
    });
});
