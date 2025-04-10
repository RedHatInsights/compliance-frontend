import { render, waitFor } from '@testing-library/react';
import SystemsTable from './SystemsTable';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';

import useQuery from 'Utilities/hooks/useQuery';
jest.mock('Utilities/hooks/useQuery');

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

const mockUseQuery = jest.fn(() => {
  return {
    data: { data: [], meta: {} },
    loading: false,
    error: undefined,
    fetch: () => ({ data: [], meta: {} }),
  };
});

describe('SystemsTable', () => {
  beforeEach(() => {
    useQuery.mockImplementation(mockUseQuery);
  });

  it('Should connect inventory with compliance filters so that full filters are passed to bulk selection', async () => {
    render(
      <TestWrapper>
        <SystemsTable {...mockProps} />
      </TestWrapper>
    );

    await waitFor(() =>
      expect(useQuery).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          endpoint: 'systems',
        })
      )
    );

    await waitFor(() =>
      expect(useQuery).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({
          endpoint: 'systemsOS',
        })
      )
    );
  });
});
