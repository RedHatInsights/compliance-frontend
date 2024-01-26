import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoResultsTable, { emptyRows } from './NoResultsTable';

describe('NoResultsTable', () => {
  it('expect to render without error', () => {
    render(<NoResultsTable />);

    expect(screen.getByText('No matching policies found')).toBeInTheDocument();
  });
});

describe('emptyRows', () => {
  it('expect to return table props for an empty table with NoResultsTable', () => {
    expect(emptyRows[0].cells[0].title()).toEqual(<NoResultsTable />);
  });
});
