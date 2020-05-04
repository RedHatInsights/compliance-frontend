import FinishedCreatePolicy from './FinishedCreatePolicy.js';
import configureStore from 'redux-mock-store';
import { policyFormValues, mutateCreateProfileMock } from '@/__fixtures__/benchmarks_rules.js';

import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';

const mockStore = configureStore();
jest.mock('../CreatePolicy/EditPolicyRules', () => {
    return <p>Systems table</p>;
});

describe('FinishedCreatePolicy', () => {
    let store;
    let component;

    beforeEach(() => {
        store = mockStore({ form: { policyForm: { values: policyFormValues } } });
    });

    it('expect to render without error', () => {
        const onClose = () => {};

        component = renderer.create(
            <MockedProvider mocks={[mutateCreateProfileMock]} addTypename={false} >
                <FinishedCreatePolicy store={store} onClose={onClose} />
            </MockedProvider>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });
});
