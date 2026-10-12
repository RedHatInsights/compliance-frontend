import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import items from '@/__fixtures__/legacy/items';
import columns from '@/__fixtures__/legacy/columns';

import { TableStateProvider } from 'bastilian-tabletools';
import ComplianceTable from './ComplianceTable';

const queryClient = new QueryClient();

describe('ComplianceTable', () => {
  const exampleItems = items(30).sort((item) => item.name);
  const defaultProps = {
    columns,
    items: exampleItems,
    'aria-label': 'Test Table',
  };

  it('expect to render', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <ComplianceTable {...defaultProps} />
        </TableStateProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByLabelText('Test Table')).toBeInTheDocument();
  });
});
