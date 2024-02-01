import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import { EditPolicySystems } from './EditPolicySystems.js';

describe('EditPolicySystems', () => {
  const defaultProps = {
    change: () => ({}),
  };

  it('expect to render without error', async () => {
    render(
      <TestWrapper>
        <EditPolicySystems
          {...defaultProps}
          osMajorVersion="7"
          selectedSystemIds={[]}
          policy={{ supportedOsVersions: ['1.2', '1.1', '1.3', '1.4'] }}
        />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Inventory Table')).toBeInTheDocument();
  });
});
