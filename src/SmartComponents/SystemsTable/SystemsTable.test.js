import { render, waitFor } from '@testing-library/react';
import SystemsTable from './SystemsTable';
import { useSystemBulkSelect } from './hooks.js';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';
jest.mock('./hooks.js', () => ({
  ...jest.requireActual('./hooks.js'),
  useSystemBulkSelect: jest.fn(() => ({})),
  useSystemsExport: jest.fn(() => ({})),
}));
jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
  InventoryTable: jest.fn(({ getEntities }) => {
    getEntities(10, {
      filters: {
        hostnameOrId: 'test-name',
        tagFilters: [],
      },
    });
    return <div data-testid="inventory-mock-component">Inventory</div>;
  }),
}));

const mockProps = {
  columns: ['test-column'],
  enableExport: true,
  policies: [],
  onSelect: jest.fn(),
  fetchApi: jest.fn(() => Promise.resolve({ data: [], meta: {} })),
  fetchCustomOSes: jest.fn(),
  ignoreOsMajorVersion: false,
  defaultFilter: 'someFilter ~ test',
};

describe('SystemsTable', () => {
  it('Should connect inventory with compliance filters so that full filters are passed to bulk selection', async () => {
    render(
      <TestWrapper>
        <SystemsTable {...mockProps} />
      </TestWrapper>,
    );
    await waitFor(() =>
      expect(useSystemBulkSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          fetchArguments: {
            filter: '(someFilter ~ test) AND display_name ~ "test-name"',
            tags: [],
          },
        }),
      ),
    );
  });
});
