import { render, waitFor } from '@testing-library/react';
import SystemsTableRest from './SystemsTableRest';
import { useSystemBulkSelect, useSystemsExport } from './hooks.js';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';
jest.mock('./hooks.js', () => ({
  ...jest.requireActual('./hooks.js'),
  useSystemBulkSelect: jest.fn(() => ({})),
  useSystemsExport: jest.fn(() => ({})),
}));
jest.mock('@/Utilities/hooks/useAPIV2FeatureFlag', () => jest.fn(() => true));
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

describe('SystemsTableRest', () => {
  it('Should connect inventory with compliance filters so that full filters are passed to bulk selection and exporting', async () => {
    render(
      <TestWrapper>
        <SystemsTableRest {...mockProps} />
      </TestWrapper>
    );
    await waitFor(() =>
      expect(useSystemBulkSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          fetchArguments: {
            filter: '(someFilter ~ test) AND display_name ~ "test-name"',
            tags: [],
          },
        })
      )
    );

    expect(useSystemsExport).toHaveBeenCalledWith(
      expect.objectContaining({
        fetchArguments: {
          filter: '(someFilter ~ test) AND display_name ~ "test-name"',
          tags: [],
        },
      })
    );
  });
});
