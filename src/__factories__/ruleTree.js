import { Factory } from 'fishery';
import { id, refId } from './helpers';
import rules from './rules';

const ruleGroupFactory = Factory.define(({ sequence, params }) => {
  return {
    ...id(),
    refId: refId('group', sequence),
    type: 'rule_group',
    children: [...rules.buildList(2, { type: 'rule' })],
    ...params,
  };
});

const ruleTreeFactory = Factory.define(({ transientParams }) => {
  return ruleGroupFactory.buildList(
    1,
    {},
    {
      transient: {
        ...transientParams,
      },
    }
  );
});

export default ruleTreeFactory;
