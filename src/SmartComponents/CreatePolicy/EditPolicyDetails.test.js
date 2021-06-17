import { policyFormValues } from '@/__fixtures__/benchmarks_rules.js';
import { EditPolicyDetails } from './EditPolicyDetails.js';

describe('EditPolicyDetails', () => {
  it('expect to render without error', () => {
    const component = shallow(
      <EditPolicyDetails
        change={() => ({})}
        policy={JSON.parse(policyFormValues.profile)}
      />
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
