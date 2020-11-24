import FinishedCreatePolicy from './FinishedCreatePolicy.js';
import configureStore from 'redux-mock-store';
import {
    policyFormValues, mutateCreateProfileMock, mutateAssociateSystemsToProfile
} from '@/__fixtures__/benchmarks_rules.js';

import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';

const mockStore = configureStore();

describe('FinishedCreatePolicy', () => {
    let store;
    let component;

    beforeEach(() => {
        store = mockStore({ form: { policyForm: { values: policyFormValues } } });
    });

    it('expect to render without error', async () => {
        const onClose = () => {};

        component = renderer.create(
            <MockedProvider mocks={[mutateCreateProfileMock, mutateAssociateSystemsToProfile]}
                addTypename={false} >
                <FinishedCreatePolicy store={store} onClose={onClose} />
            </MockedProvider>
        );

        await new Promise(resolve => setTimeout(resolve, 0)); // wait for response
        await new Promise(resolve => setTimeout(resolve, 0)); // wait for response
        expect(component.toJSON()).toMatchSnapshot();
    });
});
