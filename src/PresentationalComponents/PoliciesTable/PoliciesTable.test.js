import { render, screen, waitFor } from '@testing-library/react';
import { within } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import { policies as rawPolicies } from '@/__fixtures__/policies.js';
import { PoliciesTable } from './PoliciesTable.js';

const policies = rawPolicies.edges.map((profile) => profile.node);

describe('PoliciesTable', () => {
  it('expect to render without error', () => {
    render(
      <TestWrapper>
        <PoliciesTable policies={policies} />
      </TestWrapper>
    );
    const table = screen.queryByLabelText('Policies');

    expect(
      within(table).getByText('C2S for Red Hat Enterprise Linux 7', {
        selector: 'small',
      })
    ).toBeInTheDocument();
  });

  it('expect to render emptystate', async () => {
    render(
      <TestWrapper>
        <PoliciesTable policies={[]} />
      </TestWrapper>
    );
    const table = screen.queryByLabelText('Policies');

    await waitFor(() =>
      expect(within(table).getByRole('heading')).toHaveTextContent(
        'No matching policies found'
      )
    );
  });

  it('expect to render SystemsCountWarning for all policies with 0 total hosts', () => {
    render(
      <TestWrapper>
        <PoliciesTable
          policies={policies.map((p) => ({ ...p, totalHostCount: 0 }))}
        />
      </TestWrapper>
    );
    const table = screen.queryByLabelText('Policies');

    expect(within(table).getAllByRole('cell', { name: /^0$/i }).length).toEqual(
      10
    );
  });
});
