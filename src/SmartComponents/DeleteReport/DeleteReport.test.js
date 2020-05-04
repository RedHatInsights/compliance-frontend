jest.mock('@apollo/react-hooks');
jest.mock('../../Utilities/Dispatcher');

import { useMutation } from '@apollo/react-hooks';
import { dispatchAction } from '../../Utilities/Dispatcher';

import DeleteReport from './DeleteReport.js';

describe('DeleteReport', () => {
    const defaultProps = { };

    beforeEach(() => {
        useMutation.mockImplementation((query, options) => {
            return [function() {
                options.onCompleted();
            }];
        });
        dispatchAction.mockImplementation(() => {});
    });

    it('expect to render an open modal without error', () => {
        const component = mount(
            <DeleteReport { ...defaultProps } />
        );

        expect(toJson(component)).toMatchSnapshot();
    });
});
