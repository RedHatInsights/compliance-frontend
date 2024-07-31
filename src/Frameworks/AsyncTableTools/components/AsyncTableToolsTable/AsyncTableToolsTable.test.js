import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import items from 'Utilities/hooks/useTableTools/__fixtures__/items';
import columns from 'Utilities/hooks/useTableTools/__fixtures__/columns';
import filters from 'Utilities/hooks/useTableTools/__fixtures__/filters';

import TableStateProvider from '../TableStateProvider';
import AsyncTableToolsTable from './AsyncTableToolsTable';

describe('AsyncTableToolsTable', () => {
  const exampleItems = items(30).sort((item) => item.name);
  const smallItems = items(5).sort((item) => item.name);

  const defaultProps = {
    columns,
    'aria-label': 'Test Table',
    filters: { filterConfig: filters },
    items: exampleItems,
  };
  const paginationProps = {
    columns,
    'aria-label': 'Test Table',
    filters: { filterConfig: filters },
    items: smallItems,
  };

  it('expect to render', () => {
    render(
      <TableStateProvider>
        <AsyncTableToolsTable
          {...{
            ...defaultProps,
            options: {
              preselected: [exampleItems[1].id],
              selectedFilter: true,
              onSelect: () => {},
            },
          }}
        />
      </TableStateProvider>
    );

    expect(screen.getByLabelText('Test Table')).toBeInTheDocument();
    // expect(screen.getByLabelText('Pagination-ToolBar')).toBeInTheDocument();
  });

  it('expect to render without pagination', () => {
    render(
      <TableStateProvider>
        <AsyncTableToolsTable
          {...{
            ...paginationProps,
            options: {
              preselected: [exampleItems[1].id],
              selectedFilter: true,
              onSelect: () => {},
            },
          }}
        />
      </TableStateProvider>
    );

    expect(
      screen.queryByLabelText('Pagination-ToolBar')
    ).not.toBeInTheDocument();
  });
});
