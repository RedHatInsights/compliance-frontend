import FinishedCreatePolicy from './FinishedCreatePolicy.js';
import configureStore from 'redux-mock-store';
import {
    policyFormValues
} from '@/__fixtures__/benchmarks_rules.js';

const mockStore = configureStore();

describe('FinishedCreatePolicy', () => {
    let store;

    beforeEach(() => {
        store = mockStore({ form: { policyForm: { values: policyFormValues } } });
    });

    it('expect to render without error', async () => {
        jest.mock('SmartComponents/EditPolicy/usePolicy', () => (() => {}));

        const onClose = () => {};

        const wrapper = shallow(
            <FinishedCreatePolicy store={store} onClose={onClose} />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render finished error state', async () => {
        jest.mock('SmartComponents/EditPolicy/usePolicy', () => (() => { throw 'uh oh!'; }));

        const onClose = () => {};

        const wrapper = shallow(
            <FinishedCreatePolicy store={store} onClose={onClose} />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
