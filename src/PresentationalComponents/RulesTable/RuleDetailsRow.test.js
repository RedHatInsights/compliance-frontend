import { policies } from '@/__fixtures__/policies';

import RuleDetailsRow from './RuleDetailsRow';

describe('RuleDetailsRow', () => {
  it('expect to render without error', () => {
    const rule = policies.edges[0].node.policy.profiles[0].rules[0];
    expect(renderJson(<RuleDetailsRow {...{ rule }} />)).toMatchSnapshot();
  });
});
