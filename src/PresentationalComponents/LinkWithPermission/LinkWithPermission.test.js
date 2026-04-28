import React from 'react';
import propTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePermissions } from 'Utilities/hooks/usePermissionCheck';

jest.mock('Utilities/hooks/usePermissionCheck');

import LinkWithPermission from './LinkWithPermission';

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

jest.mock('@redhat-cloud-services/frontend-components/InsightsLink', () => ({
  __esModule: true,
  default: Link,
}));

const setPermissionMocks = ({ hasAccess, isLoading }) => {
  usePermissions.mockImplementation(() => ({ hasAccess, isLoading }));
};

describe('LinkWithPermission', () => {
  const linkText = 'Test Link';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('expect to render enabled when has access', () => {
    setPermissionMocks({
      hasAccess: true,
      isLoading: false,
    });

    render(<LinkWithPermission to="/reports">{linkText}</LinkWithPermission>);

    expect(usePermissions).toHaveBeenCalled();
    expect(screen.getByText(linkText)).toBeEnabled();
  });

  it('expect to render disabled when no access', () => {
    setPermissionMocks({
      hasAccess: false,
      isLoading: false,
    });

    render(<LinkWithPermission to="/reports">{linkText}</LinkWithPermission>);

    expect(usePermissions).toHaveBeenCalled();
    expect(screen.getByText(linkText)).toBeDisabled();
  });

  describe('LinkWithResolvedPermission', () => {
    it('uses resolved permission when hasAccess/isLoading passed, link enabled', () => {
      render(
        <LinkWithPermission to="/reports" hasAccess={true} isLoading={false}>
          {linkText}
        </LinkWithPermission>,
      );

      expect(usePermissions).not.toHaveBeenCalled();
      expect(screen.getByText(linkText)).toBeEnabled();
    });

    it('uses resolved permission when hasAccess/isLoading passed, link disabled', () => {
      render(
        <LinkWithPermission to="/reports" hasAccess={false} isLoading={false}>
          {linkText}
        </LinkWithPermission>,
      );

      expect(usePermissions).not.toHaveBeenCalled();
      expect(screen.getByText(linkText)).toBeDisabled();
    });

    it('uses resolved permission when hasAccess/isLoading passed, loading state', () => {
      render(
        <LinkWithPermission to="/reports" hasAccess={false} isLoading={true}>
          {linkText}
        </LinkWithPermission>,
      );

      expect(usePermissions).not.toHaveBeenCalled();
      expect(screen.getByText(linkText)).toBeDisabled();
    });
  });
});
