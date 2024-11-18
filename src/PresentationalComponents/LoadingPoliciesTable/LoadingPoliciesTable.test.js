import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import columns from '../PoliciesTable/Columns';

import LoadingPoliciesTable from './LoadingPoliciesTable';

describe('LoadingPoliciesTable', () => {
  it('expect to render without error', () => {
    render(<LoadingPoliciesTable />);

    expect(screen.getByLabelText('Policies loading')).toBeInTheDocument();

    columns.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
});
