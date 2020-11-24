import FinishedCreatePolicy from './FinishedCreatePolicy.js';
import configureStore from 'redux-mock-store';
import {
    policyFormValues, mutateCreateProfileMock, mutateAssociateSystemsToProfile,
    mutateCreateProfileErrorMock
} from '@/__fixtures__/benchmarks_rules.js';

import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';

const mockStore = configureStore();

describe('FinishedCreatePolicy', () => {
    let store;

    beforeEach(() => {
        store = mockStore({ form: { policyForm: { values: policyFormValues } } });
    });

    it('expect to render without error', async () => {
        const onClose = () => {};

        let component = renderer.create(
            <MockedProvider mocks={[mutateCreateProfileMock, mutateAssociateSystemsToProfile]}
                addTypename={false} >
                <FinishedCreatePolicy store={store} onClose={onClose} />
            </MockedProvider>
        );

        await new Promise(resolve => setTimeout(resolve, 100)); // wait for response
        expect(component.toJSON()).toMatchSnapshot();
    });

    it('expect to render finished error state', async () => {
        const onClose = () => {};

        let component = renderer.create(
            <MockedProvider mocks={[mutateCreateProfileErrorMock]} addTypename={false} >
                <FinishedCreatePolicy store={store} onClose={onClose} />
            </MockedProvider>
        );

        await new Promise(resolve => setTimeout(resolve, 100)); // wait for response
        expect(component.toJSON()).toMatchSnapshot();
    });
});
