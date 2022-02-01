import { policies } from '@/__fixtures__/policies';

import RuleDetailsRow from './RuleDetailsRow';

describe('RuleDetailsRow', () => {
  it('expect to render without error', () => {
    const item = policies.edges[0].node.policy.profiles[0].rules[0];
    expect(renderJson(<RuleDetailsRow {...{ item }} />)).toMatchSnapshot();
  });
});
