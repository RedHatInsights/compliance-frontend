import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditPolicySystemsTab from './EditPolicySystemsTabRest';
import {
  fetchSystemsApi,
  fetchCustomOSes,
} from 'SmartComponents/SystemsTable/constants';
import systemsFactory from '@/__factories__/systems';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';
import { waitFor } from '@testing-library/react';

jest.mock('@/Utilities/hooks/useAPIV2FeatureFlag', () => jest.fn(() => true));
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

jest.mock('SmartComponents/SystemsTable/constants', () => ({
  ...jest.requireActual('SmartComponents/SystemsTable/constants'),
  fetchSystemsApi: jest.fn(() => Promise.resolve([])),
  fetchCustomOSes: jest.fn(() => Promise.resolve([])),
}));
jest.mock('@apollo/client');

fetchSystemsApi.mockReturnValue(
  Promise.resolve({
    data: systemsFactory.buildList(2),
    meta: { total: 2 },
  })
);

fetchCustomOSes.mockReturnValue(
  Promise.resolve({
    data: ['8.1', '8.2'],
    meta: { total: 2 },
  })
);

const defaultProps = {
  policy: { os_major_version: 8 },
  onSystemSelect: jest.fn(),
  selectedSystems: ['test-system-1', 'test-system-2'],
  supportedOsVersions: [1, 2],
};
describe('EditPolicySystemsTabRest', () => {
  it('Should render with data', async () => {
    render(
      <TestWrapper>
        <EditPolicySystemsTab {...defaultProps} />
      </TestWrapper>
    );

    await screen.findByTestId('inventory-mock-component');
    await waitFor(() =>
      expect(fetchSystemsApi).toHaveBeenCalledWith(0, 10, {
        filter:
          'os_major_version = 8 AND os_minor_version ^ (1 2), display_name ~ test-name',
        sortBy: ['name:asc'],
        tags: [],
      })
    );
  });

  it('Should render with prepend component by default', async () => {
    render(
      <TestWrapper>
        <EditPolicySystemsTab {...defaultProps} />
      </TestWrapper>
    );

    await waitFor(async () =>
      expect(screen.getByTestId('prepend-component')).toHaveTextContent(
        `Select which of your RHEL ${defaultProps.policy.os_major_version} systems should be included in this policy.`
      )
    );
  });

  it.only('Should display empty state', async () => {
    fetchSystemsApi.mockReturnValue(
      Promise.resolve({
        data: [],
        meta: { total: 0 },
      })
    );

    render(
      <TestWrapper>
        <EditPolicySystemsTab {...defaultProps} />
      </TestWrapper>
    );

    await screen.findByTestId('empty-state');
  });
});
