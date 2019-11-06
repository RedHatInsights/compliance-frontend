import toJson from 'enzyme-to-json';

import ErrorPage from './ErrorPage';

describe('ErrorPage', () => {
    const defaultProps = {
        error: {
            message: 'An error message'
        }
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <ErrorPage { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
