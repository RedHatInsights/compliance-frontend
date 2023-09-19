import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';
import ErrorPage from './ErrorPage';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('ErrorPage', () => {
  it('expect to render an invalid object', () => {
    const error = {
      networkError: { statusCode: 404 },
      error: 'Not found',
    };
    const { container } = render(<ErrorPage error={error} />);

    expect(queryByText(container, 'We lost that page')).not.toBeNull();
  });

  it('expect to render a 403 error', () => {
    const error = {
      networkError: { statusCode: 403 },
      error: 'Not authorized',
    };
    const { container } = render(<ErrorPage error={error} />);

    expect(
      queryByText(container, 'You do not have access to Compliance')
    ).not.toBeNull();
  });

  it('expect to render a 401 error when logged out', () => {
    const logout = jest.fn(() => 'Logout');
    useChrome.mockImplementation(() => ({ auth: { logout } }));
    const error = {
      networkError: { statusCode: 401 },
      error: 'Test Error loading',
    };
    render(<ErrorPage error={error} />);

    expect(logout).toHaveBeenCalled();
  });
});
