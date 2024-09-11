import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import { SystemsTable } from './SystemsTableRest';

describe('SystemsTable', () => {
  it('returns an Inventory Table', () => {
    render(
      <TestWrapper>
        <SystemsTable />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Inventory Table')).toBeInTheDocument();
  });

  it('returns an Inventory Table', () => {
    render(
      <TestWrapper>
        <SystemsTable error={{ message: 'Error' }} />
      </TestWrapper>
    );

    expect(
      screen.getByRole('heading', { name: 'Something went wrong' })
    ).toBeInTheDocument();
  });

  // TODO There should also be a test to verify the empty state
});
