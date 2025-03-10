import { render, screen, waitFor } from '@testing-library/react';
import { within } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import { buildPolicies } from '../../__factories__/policies';

import { PoliciesTable } from './PoliciesTable.js';

const policies = buildPolicies(10);

describe('PoliciesTable', () => {
  it('expect to render without error', () => {
    render(
      <TestWrapper>
        <PoliciesTable policies={policies} />
      </TestWrapper>
    );
    const table = screen.queryByLabelText('Policies');

    expect(
      within(table).getByText(policies[0].profile_title, {
        selector: 'small',
      })
    ).toBeInTheDocument();
  });

  it.skip('expect to render emptystate', async () => {
    render(
      <TestWrapper>
        <PoliciesTable policies={[]} />
      </TestWrapper>
    );
    const table = screen.queryByLabelText('Policies');
    // AsyncTable doesn't respect emptyRows param and returns No matching results found
    await waitFor(() =>
      expect(within(table).getByRole('heading')).toHaveTextContent(
        'No matching policies found'
      )
    );
  });

  it('expect to render SystemsCountWarning for all policies with 0 total hosts', () => {
    const modifiedPolicies = policies.map((policy) => ({
      ...policy,
      total_system_count: 0,
    }));

    render(
      <TestWrapper>
        <PoliciesTable policies={modifiedPolicies} />
      </TestWrapper>
    );
    const table = screen.queryByLabelText('Policies');

    expect(within(table).getAllByRole('cell', { name: /^0$/i }).length).toEqual(
      10
    );
  });
});
