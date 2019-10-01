import toJson from 'enzyme-to-json';
import CreatePolicy from './CreatePolicy.js';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();
jest.mock('@apollo/react-hooks');
jest.mock('../CreatePolicy/EditPolicyRules', () => {
    return <p>Rules table</p>;
});

describe('CreatePolicy', () => {
    let store;
    let CreatePolicyWrapper;
    let CreatePolicyComponent;

    beforeEach(() => {
        store = mockStore({});
        /* eslint-disable react/display-name */
        CreatePolicyWrapper = (props) => (
            <CreatePolicy {...props} store={store} />
        );
        /* eslint-enable react/display-name */
        CreatePolicyComponent = shallow(<CreatePolicyWrapper />).dive();
    });

    it('expect to render without error', () => {
        expect(toJson(CreatePolicyComponent)).toMatchSnapshot();
    });
});
