import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import items from '../../__fixtures__/items';

import TableStateProvider from '../TableStateProvider';
import AsyncTableToolsTable from './AsyncTableToolsTable';

const exampleItems = items(100).sort((item) => item.name);
const itemsFunc = jest.fn(async () => {
  return exampleItems.slice(0, 10);
});
const ariaLabel = 'Async Test Table';
const defaultProps = {
  'aria-label': ariaLabel,
  columns: [
    {
      title: 'Name',
      key: 'name',
      renderFunc: (_a, _b, item) => item.name,
    },
  ],
  items: itemsFunc,
  total: exampleItems.length,
};

describe('AsyncTableToolsTable', () => {
  it('should render a basic table', async () => {
    render(
      <TableStateProvider>
        <AsyncTableToolsTable {...defaultProps} />
      </TableStateProvider>
    );

    await waitFor(() => expect(itemsFunc).toHaveBeenCalled());

    expect(screen.getByLabelText(ariaLabel)).toBeInTheDocument();
    expect(await screen.findByText(exampleItems[1].name)).toBeInTheDocument();
  });

  // TODO Extend with more tests for basic filtering, paginating, sorting etc.
});
