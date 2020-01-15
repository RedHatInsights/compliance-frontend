import toJson from 'enzyme-to-json';
import FinishedCreatePolicy from './FinishedCreatePolicy.js';
import configureStore from 'redux-mock-store';
import { policyFormValues } from './fixtures.js';

const mockStore = configureStore();
jest.mock('@apollo/react-hooks');
jest.mock('../CreatePolicy/EditPolicyRules', () => {
    return <p>Systems table</p>;
});

describe('FinishedCreatePolicy', () => {
    let store;
    let FinishedCreatePolicyWrapper;
    let FinishedCreatePolicyComponent;

    beforeEach(() => {
        store = mockStore({ form: { policyForm: { values: policyFormValues } } });
        /* eslint-disable react/display-name */
        FinishedCreatePolicyWrapper = (props) => (
            <FinishedCreatePolicy {...props} store={store} />
        );
        /* eslint-enable react/display-name */
        FinishedCreatePolicyComponent = shallow(<FinishedCreatePolicyWrapper />).dive();
    });

    it('expect to render without error', () => {
        expect(toJson(FinishedCreatePolicyComponent)).toMatchSnapshot();
    });
});
