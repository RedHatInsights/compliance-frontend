import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SystemsTable from 'SmartComponents/SystemsTable/SystemsTable';

jest.mock('SmartComponents/SystemsTable/SystemsTable');

import EditPolicySystemsTab from './EditPolicySystemsTab';

describe('EditPolicySystemsTab', () => {
  const defaultProps = {
    policy: { id: 'test-policy-id', os_major_version: 8 },
    onSystemSelect: jest.fn(),
    selectedSystems: ['test-system-1', 'test-system-2'],
    supportedOsVersions: [1, 2],
  };
  const mockSystemsTable = jest.fn(({ dedicatedAction }) => (
    <div>
      Mock Systems Table
      {dedicatedAction}
    </div>
  ));

  beforeEach(() => {
    mockSystemsTable.mockClear();
    SystemsTable.mockImplementation(mockSystemsTable);
  });

  it('should render a SystemsTable with a default filter for all systems', () => {
    render(<EditPolicySystemsTab {...defaultProps} />);

    expect(mockSystemsTable).toHaveBeenCalledWith(
      expect.objectContaining({
        apiEndpoint: 'systems',
        defaultFilter: 'os_major_version = 8 AND os_minor_version ^ (1 2)',
        policyId: undefined,
      }),
      {},
    );
  });

  it('should switch to policy systems when selected systems is chosen', () => {
    render(<EditPolicySystemsTab {...defaultProps} />);

    fireEvent.click(screen.getByText('Selected systems'));

    expect(mockSystemsTable).toHaveBeenLastCalledWith(
      expect.objectContaining({
        apiEndpoint: 'policySystems',
        policyId: 'test-policy-id',
        defaultFilter: undefined,
        ignoreOsMajorVersion: true,
      }),
      {},
    );
  });
});
