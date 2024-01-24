import React from 'react';
import propTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import useRoutePermissions from 'Utilities/hooks/useRoutePermissions';
jest.mock('Utilities/hooks/useRoutePermissions');

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

describe('LinkWithPermission', () => {
  it('expect to render without error', () => {
    const linkText = 'Test Link';

    useRoutePermissions.mockImplementation(() => ({
      hasAccess: true,
      isLoading: false,
    }));

    render(<LinkWithPermission to="/reports">{linkText}</LinkWithPermission>);

    expect(screen.getByText(linkText)).toBeEnabled();
  });
});
