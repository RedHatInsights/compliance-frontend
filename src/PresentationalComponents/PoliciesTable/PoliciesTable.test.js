import { render } from '@testing-library/react';
import { policies as rawPolicies } from '@/__fixtures__/policies.js';
import { PoliciesTable } from './PoliciesTable.js';

const policies = rawPolicies.edges.map((profile) => profile.node);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: () => 'Mocked Link',
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('PoliciesTable', () => {
  const defaultProps = {
    history: { push: jest.fn() },
    location: {},
  };

  it('expect to render without error', () => {
    const { asFragment } = render(
      <PoliciesTable {...defaultProps} policies={policies} />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render emptystate', () => {
    const { asFragment } = render(
      <PoliciesTable {...defaultProps} policies={[]} />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render SystemsCountWarning', () => {
    const { asFragment } = render(
      <PoliciesTable
        {...defaultProps}
        policies={policies.map((p) => ({ ...p, totalHostCount: 0 }))}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
