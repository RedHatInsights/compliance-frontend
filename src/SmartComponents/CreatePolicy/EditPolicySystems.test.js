import toJson from 'enzyme-to-json';
import EditPolicySystems from './EditPolicySystems.js';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();
jest.mock('@apollo/react-hooks');
jest.mock('../CreatePolicy/EditPolicyRules', () => {
    return <p>Systems table</p>;
});

describe('EditPolicySystems', () => {
    let store;
    let EditPolicySystemsWrapper;
    let EditPolicySystemsComponent;

    beforeEach(() => {
        store = mockStore({});
        /* eslint-disable react/display-name */
        EditPolicySystemsWrapper = (props) => (
            <EditPolicySystems {...props} store={store} />
        );
        /* eslint-enable react/display-name */
        EditPolicySystemsComponent = shallow(<EditPolicySystemsWrapper />).dive();
    });

    it('expect to render without error', () => {
        expect(toJson(EditPolicySystemsComponent)).toMatchSnapshot();
    });
});
