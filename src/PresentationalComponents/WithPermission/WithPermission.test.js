import { render } from '@testing-library/react';
import WithPermission from './WithPermission';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import {
  useRbacV1Permissions,
  useKesselPermissions,
} from 'Utilities/hooks/usePermissionCheck';

jest.mock('Utilities/hooks/useFeatureFlag');
jest.mock('Utilities/hooks/usePermissionCheck');

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

describe('WithPermission', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each([false, true])(
    'isKesselEnabled=%s - expect to render without error',
    (isKesselEnabled) => {
      setPermissionMocks(isKesselEnabled, {
        hasAccess: true,
        isLoading: false,
      });

      const { asFragment } = render(
        <WithPermission>NEEDS PERMISSION</WithPermission>,
      );

      expectCorrectPermissionHookCalled(isKesselEnabled);
      expect(asFragment()).toMatchSnapshot();
    },
  );

  test.each([false, true])(
    'isKesselEnabled=%s - expect to render nothing when loading',
    (isKesselEnabled) => {
      setPermissionMocks(isKesselEnabled, {
        hasAccess: false,
        isLoading: true,
      });

      const { asFragment } = render(
        <WithPermission>NEEDS PERMISSION</WithPermission>,
      );

      expectCorrectPermissionHookCalled(isKesselEnabled);
      expect(asFragment()).toMatchSnapshot();
    },
  );

  test.each([false, true])(
    'isKesselEnabled=%s - expect to render "No permissions" with no access',
    (isKesselEnabled) => {
      setPermissionMocks(isKesselEnabled, {
        hasAccess: false,
        isLoading: false,
      });

      const { asFragment } = render(
        <WithPermission>NEEDS PERMISSION</WithPermission>,
      );

      expectCorrectPermissionHookCalled(isKesselEnabled);
      expect(asFragment()).toMatchSnapshot();
    },
  );

  test.each([false, true])(
    'isKesselEnabled=%s - expect to render nothing when hidden and no access',
    (isKesselEnabled) => {
      setPermissionMocks(isKesselEnabled, {
        hasAccess: false,
        isLoading: false,
      });

      const { asFragment } = render(
        <WithPermission hide>NEEDS PERMISSION</WithPermission>,
      );

      expectCorrectPermissionHookCalled(isKesselEnabled);
      expect(asFragment()).toMatchSnapshot();
    },
  );
});
