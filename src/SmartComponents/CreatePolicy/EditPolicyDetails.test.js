import { render } from '@testing-library/react';
import { policyFormValues } from '@/__fixtures__/benchmarks_rules.js';
import { EditPolicyDetails } from './EditPolicyDetails.js';

describe('EditPolicyDetails', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(
      <EditPolicyDetails
        change={() => ({})}
        policy={policyFormValues.profile}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
