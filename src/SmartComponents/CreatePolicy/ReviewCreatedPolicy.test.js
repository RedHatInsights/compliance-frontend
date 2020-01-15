import toJson from 'enzyme-to-json';
import ReviewCreatedPolicy from './ReviewCreatedPolicy.js';
import configureStore from 'redux-mock-store';
import { policyFormValues } from './fixtures.js';

const mockStore = configureStore();
jest.mock('@apollo/react-hooks');
jest.mock('../CreatePolicy/EditPolicyRules', () => {
    return <p>Systems table</p>;
});

describe('ReviewCreatedPolicy', () => {
    let store;
    let ReviewCreatedPolicyWrapper;
    let ReviewCreatedPolicyComponent;

    beforeEach(() => {
        store = mockStore({ form: { policyForm: { values: policyFormValues } } });
        /* eslint-disable react/display-name */
        ReviewCreatedPolicyWrapper = (props) => (
            <ReviewCreatedPolicy {...props} store={store} />
        );
        /* eslint-enable react/display-name */
        ReviewCreatedPolicyComponent = shallow(<ReviewCreatedPolicyWrapper />).dive();
    });

    it('expect to render without error', () => {
        expect(toJson(ReviewCreatedPolicyComponent)).toMatchSnapshot();
    });
});
