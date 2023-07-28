import { render } from '@testing-library/react';
import ErrorPage from './ErrorPage';

describe('ErrorPage', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(
      <ErrorPage
        error={{
          message: 'An error message',
        }}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render an invalid object', () => {
    const error = {
      networkError: { statusCode: 404 },
      error: 'Not found',
    };
    const { asFragment } = render(<ErrorPage error={error} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render a 403 error', () => {
    const error = {
      networkError: { statusCode: 403 },
      error: 'Not authorized',
    };
    const { asFragment } = render(<ErrorPage error={error} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render a 401 error when logged out', () => {
    window.insights = {
      chrome: { auth: { logout: jest.fn(() => 'Logout') } },
    };
    const error = {
      networkError: { statusCode: 401 },
      error: 'Test Error loading',
    };
    const { asFragment } = render(<ErrorPage error={error} />);

    expect(asFragment()).toMatchSnapshot();
    expect(window.insights.chrome.auth.logout).toHaveBeenCalled();
  });
});
