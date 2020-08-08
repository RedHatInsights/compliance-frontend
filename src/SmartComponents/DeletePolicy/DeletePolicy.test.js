import { useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { dispatchAction } from 'Utilities/Dispatcher';

import DeletePolicy from './DeletePolicy.js';

jest.mock('Utilities/Dispatcher');

jest.mock('@apollo/react-hooks', () => ({
    ...require.requireActual('@apollo/react-hooks'),
    useMutation: jest.fn(() => ({}))
}));

jest.mock('react-router-dom', () => ({
    ...require.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({})),
    useHistory: jest.fn(() => ({
        push: jest.fn()
    }))
}));

describe('DeletePolicy', () => {
    const policy = { id: 1, name: 'foo' };

    beforeEach(() => {
        useMutation.mockImplementation((query, options) => {
            return [function() {
                options.onCompleted();
            }];
        });
        useLocation.mockImplementation(() => ({
            state: {
                policy
            }
        }));
        dispatchAction.mockImplementation(() => {});
    });

    it('expect to render an open modal without error', () => {
        const component = shallow(
            <DeletePolicy />
        );

        expect(toJson(component)).toMatchSnapshot();
    });
});
