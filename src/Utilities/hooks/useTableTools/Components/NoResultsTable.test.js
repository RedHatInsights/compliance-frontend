import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { NoResultsTable } from './NoResultsTable';

describe('NoResultsTable', () => {
  it('expect to render without error', () => {
    render(<NoResultsTable />);

    expect(
      screen.getByRole('heading', 'No matching results found')
    ).toBeInTheDocument();
  });
});
