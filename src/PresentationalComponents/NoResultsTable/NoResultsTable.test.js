import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';

import NoResultsTable, { emptyRows } from './NoResultsTable';

describe('NoResultsTable', () => {
  it('expect to render without error', () => {
    const { container } = render(<NoResultsTable />);

    expect(queryByText(container, 'No matching policies found')).not.toBeNull();
  });
});

describe('emptyRows', () => {
  it('expect to return table props for an empty table with NoResultsTable', () => {
    expect(emptyRows[0].cells[0].title()).toEqual(<NoResultsTable />);
  });
});
