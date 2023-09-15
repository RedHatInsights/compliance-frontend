import { render } from '@testing-library/react';
import WithPermission from './WithPermission';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';

jest.mock('@redhat-cloud-services/frontend-components-utilities/RBACHook');

describe('WithPermission', () => {
  it('expect to render without error', () => {
    usePermissionsWithContext.mockImplementation(() => ({
      hasAccess: true,
      isLoading: false,
    }));
    const { asFragment } = render(
      <WithPermission>NEEDS PERMISSION</WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render nothing when loading', () => {
    usePermissionsWithContext.mockImplementation(() => ({
      isLoading: true,
    }));
    const { asFragment } = render(
      <WithPermission>NEEDS PERMISSION</WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render "No permissions" with no access', () => {
    usePermissionsWithContext.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));
    const { asFragment } = render(
      <WithPermission>NEEDS PERMISSION</WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render nothing when hidden and no access', () => {
    usePermissionsWithContext.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));
    const { asFragment } = render(
      <WithPermission hide>NEEDS PERMISSION</WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
