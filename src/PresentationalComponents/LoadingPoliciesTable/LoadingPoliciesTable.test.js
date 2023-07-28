import { render } from '@testing-library/react';
import LoadingPoliciesTable from './LoadingPoliciesTable';

describe('LoadingPoliciesTable', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<LoadingPoliciesTable />);

    expect(asFragment()).toMatchSnapshot();
  });
});
