import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import EditPolicySystemsTab from './EditPolicySystemsTab.js';

jest.mock('@/Utilities/hooks/useAPIV2FeatureFlag', () => jest.fn(() => false));

describe('EditPolicySystemsTab', () => {
  const defaultProps = {
    policy: {
      id: '12345abcde',
      osMajorVersion: '7',
      supportedOsVersions: ['1.2', '1.1', '1.3', '1.4'],
    },
  };

  it('expect to render the Inventory Table', () => {
    render(
      <TestWrapper>
        <EditPolicySystemsTab {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Inventory Table')).toBeInTheDocument();
  });
});
