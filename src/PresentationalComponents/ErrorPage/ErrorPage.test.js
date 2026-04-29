import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useEnvironment } from 'Utilities/EnvironmentProvider';

jest.mock('Utilities/EnvironmentProvider', () => ({
  __esModule: true,
  ...jest.requireActual('Utilities/EnvironmentProvider'),
  useEnvironment: jest.fn(),
}));

import ErrorPage from './ErrorPage';

const baseEnv = {
  runtime: 'hcc',
  isIop: false,
  isHcc: true,
  hasChrome: true,
  authorizationProvider: 'rbac',
  isKesselEnabled: false,
  updateDocumentTitle: jest.fn(),
  hideGlobalFilter: jest.fn(),
  requestPdf: jest.fn(),
  logout: jest.fn(),
};

describe('ErrorPage', () => {
  beforeEach(() => {
    useEnvironment.mockReturnValue({ ...baseEnv, logout: jest.fn() });
  });

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
      screen.getByText('You do not have access to Compliance'),
    ).toBeInTheDocument();
  });

  it('expect to render a 401 error when logged out', () => {
    const logout = jest.fn(() => 'Logout');
    useEnvironment.mockReturnValue({ ...baseEnv, logout });
    const error = {
      networkError: { statusCode: 401 },
      error: 'Test Error loading',
    };
    render(<ErrorPage error={error} />);

    expect(logout).toHaveBeenCalledWith(true);
  });
});
