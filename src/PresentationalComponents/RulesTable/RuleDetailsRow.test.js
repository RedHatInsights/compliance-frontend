import { render } from '@testing-library/react';
import { policies } from '@/__fixtures__/policies';
import RuleDetailsRow from './RuleDetailsRow';

describe('RuleDetailsRow', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(
      <RuleDetailsRow
        item={policies.edges[0].node.policy.profiles[0].rules[0]}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
