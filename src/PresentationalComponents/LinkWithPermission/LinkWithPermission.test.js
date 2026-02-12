import React from 'react';
import propTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import { useRbacV1Permissions } from 'Utilities/hooks/usePermissionCheck';

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

describe('LinkWithPermission', () => {
  beforeEach(() => {
    useFeatureFlag.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('expect to render without error', () => {
    const linkText = 'Test Link';

    useRbacV1Permissions.mockImplementation(() => ({
      hasAccess: true,
      isLoading: false,
    }));

    render(<LinkWithPermission to="/reports">{linkText}</LinkWithPermission>);

    expect(screen.getByText(linkText)).toBeEnabled();
  });
});
