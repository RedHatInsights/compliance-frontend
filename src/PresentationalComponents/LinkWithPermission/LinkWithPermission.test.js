import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import LinkWithPermission, { LinkWithRBAC } from './LinkWithPermission';
import useRoutePermissions from 'Utilities/hooks/useRoutePermissions';

jest.mock('Utilities/hooks/useRoutePermissions');

import propTypes from 'prop-types';
const Link = ({ children, isDisabled, ...props }) => {
  return (
    <button {...props} disabled={isDisabled}>
      {children}
    </button>
  );
};

Link.propTypes = {
  isDisabled: propTypes.bool,
  children: propTypes.node,
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link,
}));

const linkText = 'Test Link';

describe('LinkWithPermission', () => {
  it('expect to render without error', () => {
    useRoutePermissions.mockImplementation(() => ({
      hasAccess: true,
      isLoading: false,
    }));
    render(<LinkWithPermission to="/reports">{linkText}</LinkWithPermission>);

    expect(screen.getByText(linkText)).not.toBeDisabled();
  });
});

describe('LinkWithRBAC', () => {
  it('expect to render without error', () => {
    useRoutePermissions.mockImplementation(() => ({
      hasAccess: true,
      isLoading: false,
    }));
    render(<LinkWithRBAC to="/reports">{linkText}</LinkWithRBAC>);

    expect(screen.getByText(linkText)).not.toBeDisabled();
  });

  it('expect to render without error and disabled', () => {
    useRoutePermissions.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));
    render(<LinkWithRBAC to="/reports">Test Link</LinkWithRBAC>);

    expect(screen.getByText(linkText)).toBeDisabled();
  });
});
