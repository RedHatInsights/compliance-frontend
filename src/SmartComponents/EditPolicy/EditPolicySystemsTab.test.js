import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SystemsTable from 'SmartComponents/SystemsTable/SystemsTable';

jest.mock('SmartComponents/SystemsTable/SystemsTable');

import EditPolicySystemsTab from './EditPolicySystemsTab';

describe('EditPolicySystemsTab', () => {
  const defaultProps = {
    policy: { os_major_version: 8 },
    onSystemSelect: jest.fn(),
    selectedSystems: ['test-system-1', 'test-system-2'],
    supportedOsVersions: [1, 2],
  };
  const mockSystemsTable = jest.fn(() => <div>Mock Systems Table</div>);

  it('should render a SystemsTable with a default filter', () => {
    SystemsTable.mockImplementation(mockSystemsTable);
    render(<EditPolicySystemsTab {...defaultProps} />);

    expect(mockSystemsTable).toHaveBeenCalledWith(
      expect.objectContaining({
        apiEndpoint: 'systems',
        defaultFilter: 'os_major_version = 8 AND os_minor_version ^ (1 2)',
      }),
      {},
    );
  });
});
