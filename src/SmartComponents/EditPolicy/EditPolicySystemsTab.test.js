import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';
import systemsFactory from '@/__factories__/systems';
import useQuery from 'Utilities/hooks/useQuery';

import EditPolicySystemsTab from './EditPolicySystemsTab';

jest.mock('Utilities/hooks/useQuery');

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
  InventoryTable: jest.fn(({ getEntities }) => {
    getEntities(null, {
      page: 1,
      per_page: 10,
      orderBy: 'name',
      orderDirection: 'asc',
      filters: {
        hostnameOrId: 'test-name',
        tagFilters: [],
      },
    });
    return <div data-testid="inventory-mock-component">Inventory</div>;
  }),
}));

const defaultProps = {
  policy: { os_major_version: 8 },
  onSystemSelect: jest.fn(),
  selectedSystems: ['test-system-1', 'test-system-2'],
  supportedOsVersions: [1, 2],
};

const mockUseQuery = jest.fn(() => ({
  fetch: () => ({
    data: systemsFactory.buildList(100),
    meta: { total: 100 },
  }),
}));

describe('EditPolicySystemsTab', () => {
  beforeEach(() => {
    useQuery.mockImplementation(mockUseQuery);
  });

  it('Should render with data', async () => {
    render(
      <TestWrapper>
        <EditPolicySystemsTab {...defaultProps} />
      </TestWrapper>,
    );

    await screen.findByTestId('inventory-mock-component');
  });

  it('Should render with prepend component by default', async () => {
    render(
      <TestWrapper>
        <EditPolicySystemsTab {...defaultProps} />
      </TestWrapper>,
    );

    await waitFor(async () =>
      expect(screen.getByTestId('prepend-component')).toHaveTextContent(
        `Select which of your RHEL ${defaultProps.policy.os_major_version} systems should be included in this policy.`,
      ),
    );
  });
});
