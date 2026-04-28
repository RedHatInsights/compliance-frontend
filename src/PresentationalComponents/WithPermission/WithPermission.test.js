import { render } from '@testing-library/react';
import WithPermission from './WithPermission';
import { usePermissions } from 'Utilities/hooks/usePermissionCheck';

jest.mock('Utilities/hooks/usePermissionCheck');

const setPermissionMocks = ({ hasAccess, isLoading }) => {
  usePermissions.mockImplementation(() => ({ hasAccess, isLoading }));
};

describe('WithPermission', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('expect to render without error', () => {
    setPermissionMocks({
      hasAccess: true,
      isLoading: false,
    });

    const { asFragment } = render(
      <WithPermission>NEEDS PERMISSION</WithPermission>,
    );

    expect(usePermissions).toHaveBeenCalled();
    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render nothing when loading', () => {
    setPermissionMocks({
      hasAccess: false,
      isLoading: true,
    });

    const { asFragment } = render(
      <WithPermission>NEEDS PERMISSION</WithPermission>,
    );

    expect(usePermissions).toHaveBeenCalled();
    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render "No permissions" with no access', () => {
    setPermissionMocks({
      hasAccess: false,
      isLoading: false,
    });

    const { asFragment } = render(
      <WithPermission>NEEDS PERMISSION</WithPermission>,
    );

    expect(usePermissions).toHaveBeenCalled();
    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render nothing when hidden and no access', () => {
    setPermissionMocks({
      hasAccess: false,
      isLoading: false,
    });

    const { asFragment } = render(
      <WithPermission hide>NEEDS PERMISSION</WithPermission>,
    );

    expect(usePermissions).toHaveBeenCalled();
    expect(asFragment()).toMatchSnapshot();
  });
});
