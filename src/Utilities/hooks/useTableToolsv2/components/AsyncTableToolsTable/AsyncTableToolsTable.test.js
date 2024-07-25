import React from 'react';
import { render } from '@testing-library/react';
import AsyncTableToolsTable from './AsyncTableToolsTable';
import items from '../../__fixtures__/items';
import columns from '../../__fixtures__/columns';
import filters from '../../__fixtures__/filters';
import filterHelpers from './testHelpers.js';

expect.extend(filterHelpers);

describe('AsyncTableToolsTable', () => {
  const exampleItems = items(30).sort((item) => item.name);
  const defaultProps = {
    columns,
    'aria-label': 'Test Table',
    filters: { filterConfig: filters },
    items: exampleItems,
  };

  it('expect to have filters properly rendered', () => {
    const component = <AsyncTableToolsTable {...defaultProps} />;
    expect(component).toHaveFiltersFor(filters);
  });

  it('expect to have filters properly rendered', () => {
    const component = (
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
    );
    const { container } = render(component);
    const toolbar = container.querySelector('#ins-primary-data-toolbar');

    expect(toolbar).toMatchSnapshot();
  });
});
