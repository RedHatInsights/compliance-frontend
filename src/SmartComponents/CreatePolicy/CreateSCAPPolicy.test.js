import toJson from 'enzyme-to-json';
import CreateSCAPPolicy from './CreateSCAPPolicy.js';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();
jest.mock('@apollo/react-hooks');

describe('CreateSCAPPolicy', () => {
    let store;
    let CreateSCAPPolicyWrapper;
    let CreateSCAPPolicyComponent;

    beforeEach(() => {
        store = mockStore({});
        /* eslint-disable react/display-name */
        CreateSCAPPolicyWrapper = (props) => (
            <CreateSCAPPolicy {...props} store={store} />
        );
        /* eslint-enable react/display-name */
        CreateSCAPPolicyComponent = shallow(<CreateSCAPPolicyWrapper />).dive();
    });

    it('expect to render without error', () => {
        expect(toJson(CreateSCAPPolicyComponent)).toMatchSnapshot();
    });
});
