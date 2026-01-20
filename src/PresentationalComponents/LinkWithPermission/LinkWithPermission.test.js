import React from 'react';
import propTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import {
  useRbacV1Permissions,
  useKesselPermissions,
} from 'Utilities/hooks/usePermissionCheck';

jest.mock('Utilities/hooks/useFeatureFlag');
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

const setPermissionMocks = (isKesselEnabled, { hasAccess, isLoading }) => {
  useFeatureFlag.mockReturnValue(isKesselEnabled);
  if (isKesselEnabled) {
    useKesselPermissions.mockImplementation(() => ({ hasAccess, isLoading }));
  } else {
    useRbacV1Permissions.mockImplementation(() => ({ hasAccess, isLoading }));
  }
};

const expectCorrectPermissionHookCalled = (isKesselEnabled) => {
  if (isKesselEnabled) {
    expect(useKesselPermissions).toHaveBeenCalled();
    expect(useRbacV1Permissions).not.toHaveBeenCalled();
  } else {
    expect(useRbacV1Permissions).toHaveBeenCalled();
    expect(useKesselPermissions).not.toHaveBeenCalled();
  }
};

describe('LinkWithPermission', () => {
  const linkText = 'Test Link';

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each([false, true])(
    'isKesselEnabled=%s - expect to render enabled when has access',
    (isKesselEnabled) => {
      setPermissionMocks(isKesselEnabled, {
        hasAccess: true,
        isLoading: false,
      });

      render(<LinkWithPermission to="/reports">{linkText}</LinkWithPermission>);

      expectCorrectPermissionHookCalled(isKesselEnabled);
      expect(screen.getByText(linkText)).toBeEnabled();
    },
  );

  test.each([false, true])(
    'isKesselEnabled=%s - expect to render disabled when no access',
    (isKesselEnabled) => {
      setPermissionMocks(isKesselEnabled, {
        hasAccess: false,
        isLoading: false,
      });

      render(<LinkWithPermission to="/reports">{linkText}</LinkWithPermission>);

      expectCorrectPermissionHookCalled(isKesselEnabled);
      expect(screen.getByText(linkText)).toBeDisabled();
    },
  );

  describe('LinkWithResolvedPermission', () => {
    it('uses resolved permission when isKesselEnabled and hasAccess/isLoading passed, link enabled', () => {
      useFeatureFlag.mockReturnValue(true);

      render(
        <LinkWithPermission to="/reports" hasAccess={true} isLoading={false}>
          {linkText}
        </LinkWithPermission>,
      );

      expect(useRbacV1Permissions).not.toHaveBeenCalled();
      expect(useKesselPermissions).not.toHaveBeenCalled();
      expect(screen.getByText(linkText)).toBeEnabled();
    });

    it('uses resolved permission when isKesselEnabled and hasAccess/isLoading passed, link disabled', () => {
      useFeatureFlag.mockReturnValue(true);

      render(
        <LinkWithPermission to="/reports" hasAccess={false} isLoading={false}>
          {linkText}
        </LinkWithPermission>,
      );

      expect(useRbacV1Permissions).not.toHaveBeenCalled();
      expect(useKesselPermissions).not.toHaveBeenCalled();
      expect(screen.getByText(linkText)).toBeDisabled();
    });

    it('uses resolved permission when isKesselEnabled and hasAccess/isLoading passed, loading state', () => {
      useFeatureFlag.mockReturnValue(true);

      render(
        <LinkWithPermission to="/reports" hasAccess={false} isLoading={true}>
          {linkText}
        </LinkWithPermission>,
      );

      expect(useRbacV1Permissions).not.toHaveBeenCalled();
      expect(useKesselPermissions).not.toHaveBeenCalled();
      expect(screen.getByText(linkText)).toBeDisabled();
    });
  });
});
