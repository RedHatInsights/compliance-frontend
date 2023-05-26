import { growTableTree, validatorFor, disableEdit } from './helpers';

describe('growTableTree', () => {
  const ruleTree = [
    {
      type: 'rule_group',
      title: 'RG 1',
      children: [
        {
          type: 'rule_group',
          title: 'RG 1.1',
          children: [
            {
              type: 'rule',
              title: 'Rule RG 1.1.1',
              itemId: '|1.1.1',
            },
            {
              type: 'rule',
              title: 'Rule RG 1.1.2',
              itemId: '|1.1.2',
            },
          ],
        },
        {
          type: 'rule_group',
          title: 'RG 1.2',
          children: [
            {
              type: 'rule',
              title: 'Rule RG 1.2.1',
              itemId: '|1.2.1',
            },
            {
              type: 'rule',
              title: 'Rule RG 1.2.2',
              itemId: '|1.2.2',
            },
          ],
        },
      ],
    },
    {
      type: 'rule_group',
      title: 'RG 2',
      children: [
        {
          type: 'rule',
          title: 'Rule RG 2.1',
          itemid: '|2.1',
        },
        {
          type: 'rule',
          title: 'Rule RG 2.2',
          itemid: '|2.2',
        },
      ],
    },
  ];
  const rules = [
    { title: 'Rule 1.1.1', profile: { id: '' }, refId: '1.1.2' },
    { title: 'Rule 1.1.2', profile: { id: '' }, refId: '1.1.2' },
    { title: 'Rule 1.2.1', profile: { id: '' }, refId: '1.2.1' },
    { title: 'Rule 1.2.2', profile: { id: '' }, refId: '1.2.2' },
    { title: 'Rule 2.2', profile: { id: '' }, refId: '2.2' },
    { title: 'Rule 2.1', profile: { id: '' }, refId: '2.1' },
  ];

  it('returns a tableTree', () => {
    expect(growTableTree({ benchmark: { ruleTree } }, rules)).toMatchSnapshot();
  });
});

describe('validatorFor', () => {
  describe('Number validator', () => {
    const validator = validatorFor({
      type: 'number',
    });

    it('should return true if inputs are numbers or strings in numbers', () => {
      expect(
        [0, 1, 2, '3', 4, '5', '6'].every((num) => validator(num))
      ).toBeTruthy();
    });

    it('should return false if inputs are strings and not numbers', () => {
      expect(['blub', 'blob', 'blab'].every((num) => validator(num))).toBe(
        false
      );
    });
  });
});

describe('disabledEdit', () => {
  it('should return true if a string contains newline characters', () => {
    expect(disableEdit('Test\n\rasdasda')).toBeTruthy();
  });

  it('should return false when there are no new line characters', () => {
    expect(disableEdit('Normal string with no newline')).toBe(false);
  });
});
