import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import LinkWithPermission, { LinkWithRBAC } from './LinkWithPermission';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import useFeature from 'Utilities/hooks/useFeature';
jest.mock('Utilities/hooks/useFeature');

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

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/RBACHook',
  () => ({
    ...jest.requireActual(
      '@redhat-cloud-services/frontend-components-utilities/RBACHook'
    ),
    usePermissionsWithContext: jest.fn(() => ({
      hasAccess: true,
      isLoading: false,
    })),
  })
);

const linkText = 'Test Link';

describe('LinkWithPermission', () => {
  beforeEach(() => {
    usePermissionsWithContext.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));
  });

  it('expect to render without error', () => {
    useFeature.mockImplementation(() => false);
    render(<LinkWithPermission to="/reports">{linkText}</LinkWithPermission>);

    expect(screen.getByText(linkText)).not.toBeDisabled();
  });

  it('expect to render a disabled button if rbac is enabled', () => {
    useFeature.mockImplementation(() => true);
    render(<LinkWithPermission to="/reports">{linkText}</LinkWithPermission>);

    expect(screen.getByText(linkText)).toBeDisabled();
  });
});

describe('LinkWithRBAC', () => {
  beforeEach(() => {
    useFeature.mockImplementation(() => true);
  });

  it('expect to render without error', () => {
    usePermissionsWithContext.mockImplementation(() => ({
      hasAccess: true,
      isLoading: false,
    }));
    render(<LinkWithRBAC to="/reports">{linkText}</LinkWithRBAC>);

    expect(screen.getByText(linkText)).not.toBeDisabled();
  });

  it('expect to render without error and disabled', () => {
    usePermissionsWithContext.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));
    render(<LinkWithRBAC to="/reports">Test Link</LinkWithRBAC>);

    expect(screen.getByText(linkText)).toBeDisabled();
  });
});
