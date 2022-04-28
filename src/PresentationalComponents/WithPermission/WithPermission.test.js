import { render } from '@testing-library/react';
import WithPermission from './WithPermission';
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';

import useFeature from 'Utilities/hooks/useFeature';
jest.mock('Utilities/hooks/useFeature');
jest.mock('@redhat-cloud-services/frontend-components-utilities/RBACHook');

describe('WithPermission', () => {
  it('expect to render without error', () => {
    useFeature.mockImplementation(() => true);
    usePermissions.mockImplementation(() => ({
      hasAccess: true,
      isLoading: false,
    }));
    const { asFragment } = render(
      <WithPermission>NEEDS PERMISSION</WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render with rbac disabled', () => {
    useFeature.mockImplementation(() => false);
    usePermissions.mockImplementation(() => ({
      hasAccess: true,
      isLoading: false,
    }));
    const { asFragment } = render(
      <WithPermission>NEEDS PERMISSION</WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render "No permissions" with no access', () => {
    useFeature.mockImplementation(() => true);
    usePermissions.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));
    const { asFragment } = render(
      <WithPermission>NEEDS PERMISSION</WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render nothing when hidden and no access', () => {
    useFeature.mockImplementation(() => true);
    usePermissions.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));
    const { asFragment } = render(
      <WithPermission hide>NEEDS PERMISSION</WithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
