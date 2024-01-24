import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import ErrorPage from './ErrorPage';

describe('ErrorPage', () => {
  it('expect to render an invalid object', () => {
    const error = {
      networkError: { statusCode: 404 },
      error: 'Not found',
    };
    render(<ErrorPage error={error} />);

    expect(screen.getByText('We lost that page')).toBeInTheDocument();
  });

  it('expect to render a 403 error', () => {
    const error = {
      networkError: { statusCode: 403 },
      error: 'Not authorized',
    };
    render(<ErrorPage error={error} />);

    expect(
      screen.getByText('You do not have access to Compliance')
    ).toBeInTheDocument();
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
