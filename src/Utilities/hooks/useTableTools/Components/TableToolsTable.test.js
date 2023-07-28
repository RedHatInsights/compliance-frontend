import { render, act } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';

import TableToolsTable from './TableToolsTable';
import items from '../__fixtures__/items';
import columns from '../__fixtures__/columns';
import filters from '../__fixtures__/filters';
import { filterHelpers } from '../testHelpers.js';

expect.extend(filterHelpers);

describe('TableToolsTable', () => {
  const exampleItems = items(30).sort((item) => item.name);
  const defaultProps = {
    columns,
    'aria-label': 'Test Table',
    filters: { filterConfig: filters },
    items: exampleItems,
  };

  it('expect to render without error', () => {
    const { asFragment } = render(<TableToolsTable {...defaultProps} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to have filters properly rendered', () => {
    const component = <TableToolsTable {...defaultProps} />;
    expect(component).toHaveFiltersFor(filters);
  });

  it('expect to have filters properly rendered', () => {
    const component = (
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
    const { container } = render(component);
    const toolbar = container.querySelector('#ins-primary-data-toolbar');

    expect(
      container.querySelector('.pf-c-pagination__total-items')
    ).toMatchSnapshot();

    act(() => {
      const onlyToggle = queryByText(toolbar, 'Selected only', {
        selector: '.pf-m-off',
      });
      onlyToggle.click();
    });

    expect(
      container.querySelector('.pf-c-pagination__total-items')
    ).toMatchSnapshot();
  });
});
