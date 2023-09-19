import { render } from '@testing-library/react';
import { queryByLabelText, within } from '@testing-library/dom';
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
    const { container } = render(<PoliciesTable policies={policies} />);
    const table = queryByLabelText(container, 'Policies');

    expect(
      within(table).queryByText('C2S for Red Hat Enterprise Linux 7', {
        selector: 'small',
      })
    ).not.toBeNull();
  });

  it('expect to render emptystate', () => {
    const { container } = render(<PoliciesTable policies={[]} />);
    const table = queryByLabelText(container, 'Policies');

    expect(
      within(table).queryByText('No matching policies found')
    ).not.toBeNull();
  });

  it('expect to render SystemsCountWarning for all policies with 0 total hosts', () => {
    const { container } = render(
      <PoliciesTable
        policies={policies.map((p) => ({ ...p, totalHostCount: 0 }))}
      />
    );
    const table = queryByLabelText(container, 'Policies');

    expect(table.querySelectorAll('svg[class="ins-u-warning"]').length).toEqual(
      10
    );
  });
});
