import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/react';
import '@testing-library/jest-dom';

import { policies as rawPolicies } from '@/__fixtures__/policies.js';
import { PoliciesTable } from './PoliciesTable.js';

const policies = rawPolicies.edges.map((profile) => profile.node);

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate',
  () => () => ({})
);

jest.mock('@redhat-cloud-services/frontend-components/InsightsLink', () => ({
  __esModule: true,
  default: ({ children, isDisabled, ...props }) => {
    return (
      <button {...props} disabled={isDisabled}>
        {children}
      </button>
    );
  },
}));

describe('PoliciesTable', () => {
  it('expect to render without error', () => {
    render(<PoliciesTable policies={policies} />);
    const table = screen.queryByLabelText('Policies');

    expect(
      within(table).getByText('C2S for Red Hat Enterprise Linux 7', {
        selector: 'small',
      })
    ).toBeInTheDocument();
  });

  it('expect to render emptystate', () => {
    render(<PoliciesTable policies={[]} />);
    const table = screen.queryByLabelText('Policies');

    expect(
      within(table).getByText('No matching policies found')
    ).toBeInTheDocument();
  });

  it('expect to render SystemsCountWarning for all policies with 0 total hosts', () => {
    render(
      <PoliciesTable
        policies={policies.map((p) => ({ ...p, totalHostCount: 0 }))}
      />
    );
    const table = screen.queryByLabelText('Policies');

    expect(within(table).getAllByRole('cell', { name: /^0$/i }).length).toEqual(
      10
    );
  });
});
