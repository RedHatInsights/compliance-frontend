import { render } from '@testing-library/react';
import NoResultsTable, { emptyRows } from './NoResultsTable';

describe('NoResultsTable', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<NoResultsTable />);

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('emptyRows', () => {
  it('expect to render without error', () => {
    expect(emptyRows).toMatchSnapshot();
  });
});
