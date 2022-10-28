import { render, screen } from '@testing-library/react';
import WithPermission from './WithPermission';

import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
jest.mock('@redhat-cloud-services/frontend-components-utilities/RBACHook');

describe('WithPermission', () => {
  it('expect to render without error', async () => {
    usePermissions.mockImplementation(() => ({
      hasAccess: true,
      isLoading: false,
    }));

    render(<WithPermission>NEEDS PERMISSION</WithPermission>);
    expect(await screen.queryAllByText('NEEDS PERMISSION').length).toEqual(1);
  });

  it('expect to render "No permissions" with no access', async () => {
    usePermissions.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));

    render(<WithPermission>NEEDS PERMISSION</WithPermission>);
    expect(await screen.queryAllByText('NEEDS PERMISSION').length).toEqual(0);
  });

  it('expect to render nothing when loading', async () => {
    usePermissions.mockImplementation(() => ({
      hasAccess: false,
      isLoading: true,
    }));

    render(<WithPermission>NEEDS PERMISSION</WithPermission>);
    expect(await screen.queryAllByText('NEEDS PERMISSION').length).toEqual(0);
  });

  it('expect to render nothing when hidden', async () => {
    usePermissions.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));

    render(<WithPermission hide>NEEDS PERMISSION</WithPermission>);
    expect(await screen.queryAllByText('NEEDS PERMISSION').length).toEqual(0);
  });
});
