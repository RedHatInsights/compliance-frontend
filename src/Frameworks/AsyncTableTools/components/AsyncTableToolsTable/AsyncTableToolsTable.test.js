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
  const defaultProps = {
    columns,
    'aria-label': 'Test Table',
    filters: { filterConfig: filters },
    items: exampleItems,
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
  });
});
