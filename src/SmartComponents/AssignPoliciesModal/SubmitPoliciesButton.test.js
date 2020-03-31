import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { Button } from '@patternfly/react-core';
import { dispatchAction } from '../../Utilities/Dispatcher';
import { MockedProvider } from '@apollo/react-testing';
import { SubmitPoliciesButton, completedMessage } from './SubmitPoliciesButton.js';
import renderer, { act } from 'react-test-renderer';
import { ASSOCIATE_PROFILES_TO_SYSTEM } from '../../Utilities/graphql/mutations';

jest.mock('../../Utilities/Dispatcher');
jest.mock('@redhat-cloud-services/frontend-components-notifications');

describe('SubmitPoliciesButton', () => {
    const defaultProps = {
        toggle: jest.fn(),
        dispatch: jest.fn(),
        policyIds: ['1', '2', '3'],
        system: { id: '1', name: 'foo' }
    };

    beforeEach(() => {
        dispatchAction.mockImplementation(() => {});
        addNotification.mockImplementation(() => {});
    });

    it('expect to render button without error', () => {
        const component = renderer.create(
            <MockedProvider>
                <SubmitPoliciesButton { ...defaultProps } />
            </MockedProvider>
        );

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('expect to call toggle when clicked', async () => {
        const mocks = [
            {
                request: {
                    query: ASSOCIATE_PROFILES_TO_SYSTEM,
                    variables: { input: { policyIds: ['1'], id: '1' } }
                },
                result: () => {
                    return {
                        data: {
                            system: {
                                name: 'foo',
                                profiles: [{
                                    id: '1',
                                    name: 'profile1'
                                }]
                            }
                        }
                    };
                }
            }
        ];
        const component = renderer.create(
            <MockedProvider mocks={mocks} addTypename={false}>
                <SubmitPoliciesButton { ...defaultProps } />
            </MockedProvider>
        );

        const button = component.root.findByType(Button);
        await act(async () => {
            await button.props.onClick(); // fires the mutation
        });
        expect(addNotification).toHaveBeenCalled();
        expect(defaultProps.toggle).toHaveBeenCalled();
        expect(defaultProps.dispatch).toHaveBeenCalled();
    });

    it('displays an special message if no profiles are available', () => {
        const system = { name: 'foo', profiles: [] };
        expect(completedMessage(system)).toMatchSnapshot();
    });
});
