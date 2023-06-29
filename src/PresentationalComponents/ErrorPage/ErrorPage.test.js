import ErrorPage from './ErrorPage';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

jest.mock('@redhat-cloud-services/frontend-components/useChrome');

describe('ErrorPage', () => {
  it('expect to render without error', () => {
    const wrapper = shallow(
      <ErrorPage
        error={{
          message: 'An error message',
        }}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render an invalid object', () => {
    const error = {
      networkError: { statusCode: 404 },
      error: 'Not found',
    };
    const wrapper = shallow(<ErrorPage error={error} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render a 403 error', () => {
    const error = {
      networkError: { statusCode: 403 },
      error: 'Not authorized',
    };
    const wrapper = shallow(<ErrorPage error={error} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render a 401 error when logged out', () => {
    const logout = jest.fn(() => 'Logout');
    useChrome.mockImplementation(() => ({ auth: { logout } }));

    const error = {
      networkError: { statusCode: 401 },
      error: 'Test Error loading',
    };
    const wrapper = shallow(<ErrorPage error={error} />);

    expect(toJson(wrapper)).toMatchSnapshot();
    expect(logout).toHaveBeenCalled();
  });
});
