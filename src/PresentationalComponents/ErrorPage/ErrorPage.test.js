import ErrorPage from './ErrorPage';

describe('ErrorPage', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <ErrorPage error={{
                message: 'An error message'
            }} />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render an invalid object', () => {
        const error = {
            networkError: { statusCode: 404 },
            error: 'Not found'
        };
        const wrapper = shallow(
            <ErrorPage error={ error } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render a 401 error when logged out', () => {
        window.insights = {
            chrome: { auth: { logout: jest.fn(() => 'Logout') } }
        };
        const error = {
            networkError: { statusCode: 401 },
            error: 'Test Error loading'
        };
        const wrapper = shallow(
            <ErrorPage error={ error } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(window.insights.chrome.auth.logout).toHaveBeenCalled();
    });
});
