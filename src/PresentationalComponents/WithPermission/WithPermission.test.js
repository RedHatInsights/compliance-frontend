import { render } from '@testing-library/react';
import WithPermission from './WithPermission';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import { useRbacV1Permissions } from 'Utilities/hooks/usePermissionCheck';

jest.mock('Utilities/hooks/useFeatureFlag');
jest.mock('Utilities/hooks/usePermissionCheck');

describe('WithPermission', () => {
  beforeEach(() => {
    useFeatureFlag.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('expect to render without error', () => {
    useRbacV1Permissions.mockImplementation(() => ({
      hasAccess: true,
      isLoading: false,
    }));
    const { asFragment } = render(
      <WithPermission>NEEDS PERMISSION</WithPermission>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render nothing when loading', () => {
    useRbacV1Permissions.mockImplementation(() => ({
      hasAccess: false,
      isLoading: true,
    }));
    const { asFragment } = render(
      <WithPermission>NEEDS PERMISSION</WithPermission>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render "No permissions" with no access', () => {
    useRbacV1Permissions.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));
    const { asFragment } = render(
      <WithPermission>NEEDS PERMISSION</WithPermission>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render nothing when hidden and no access', () => {
    useRbacV1Permissions.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));
    const { asFragment } = render(
      <WithPermission hide>NEEDS PERMISSION</WithPermission>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
