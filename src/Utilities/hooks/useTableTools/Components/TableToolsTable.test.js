import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import items from '../__fixtures__/items';
import columns from '../__fixtures__/columns';
import filters from '../__fixtures__/filters';
import { filterHelpers } from '../testHelpers.js';
expect.extend(filterHelpers);

import TableToolsTable from './TableToolsTable';

describe('TableToolsTable', () => {
  const exampleItems = items(30).sort((item) => item.name);
  const defaultProps = {
    columns,
    'aria-label': 'Test Table',
    filters: { filterConfig: filters },
    items: exampleItems,
  };

  it('expect to have toolbar properly rendered', async () => {
    render(
      <TableToolsTable
        {...{
          ...defaultProps,
          options: {
            preselected: [exampleItems[1].id],
            selectedFilter: true,
            onSelect: () => {},
          },
        }}
      />
    );

    const toolbar = screen.getByLabelText('Table toolbar');
    await screen.findByLabelText('Table toolbar');

    expect(
      within(toolbar).getByLabelText('Conditional filter toggle')
    ).toBeInTheDocument();

    expect(
      within(toolbar).getByLabelText('kebab dropdown toggle')
    ).toBeInTheDocument();
    expect(within(toolbar).getByLabelText('Pagination')).toBeInTheDocument();
  });

  // TODO This can be properly implemented once on react 18 and newer RTL packages
  it.skip('expect to have filters properly rendered', () => {
    render(<TableToolsTable {...defaultProps} />);

    expect(screen.getByLabelText('Table toolbar')).toHaveFiltersFor(filters);
  });
});
