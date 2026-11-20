import {
  uniq,
  sortingByProp,
  capitalizeWord,
  stringToSentenceCase,
  getTerm,
  pluralizeTerm,
} from './helpers';

describe('uniq', () => {
  it('should deduplicate items', () => {
    let result = uniq(['a', 'b', 'b', 'c']);
    expect(result.sort()).toEqual(['a', 'b', 'c']);
  });
});

describe('sortingByProp', () => {
  it('should sort string properties', () => {
    const input = [{ prop: 'c' }, { prop: 'd' }, { prop: 'a' }];
    expect(input.sort(sortingByProp('prop'))).toEqual([
      { prop: 'a' },
      { prop: 'c' },
      { prop: 'd' },
    ]);
  });

  it('should sort string properties descending', () => {
    const input = [{ prop: 'c' }, { prop: 'd' }, { prop: 'a' }];
    expect(input.sort(sortingByProp('prop', 'desc'))).toEqual([
      { prop: 'd' },
      { prop: 'c' },
      { prop: 'a' },
    ]);
  });

  it('should sort nubmer poperties', () => {
    const input = [{ prop: 10 }, { prop: 1 }, { prop: 0 }];
    expect(input.sort(sortingByProp('prop'))).toEqual([
      { prop: 0 },
      { prop: 1 },
      { prop: 10 },
    ]);
  });

  it('should sort string properties naturally', () => {
    const input = [{ prop: '10' }, { prop: '1' }, { prop: '5' }];
    expect(input.sort(sortingByProp('prop'))).toEqual([
      { prop: '1' },
      { prop: '5' },
      { prop: '10' },
    ]);
  });

  it('should sort with a missing poperty', () => {
    const input = [
      { prop: 'c' },
      { otherProp: 'z' },
      { prop: 'd' },
      { prop: 'a' },
    ];
    expect(input.sort(sortingByProp('prop'))).toEqual([
      { otherProp: 'z' },
      { prop: 'a' },
      { prop: 'c' },
      { prop: 'd' },
    ]);
  });

  it('should sort with a null item', () => {
    const input = [{ prop: 'c' }, null, { prop: 'd' }, { prop: 'a' }];
    expect(input.sort(sortingByProp('prop'))).toEqual([
      null,
      { prop: 'a' },
      { prop: 'c' },
      { prop: 'd' },
    ]);
  });
});

describe('capitalizeWord', () => {
  it('should capitalize single word', () => {
    const result = capitalizeWord('foobar');
    expect(result).toEqual('Foobar');
  });
});

describe('stringToSentenceCase', () => {
  it('should apply sentence case to string', () => {
    const result = stringToSentenceCase('this Is A Test String');
    expect(result).toEqual('This is a test string');
  });
});

describe('getTerm', () => {
  it('getTerm returns the correct term', () => {
    expect(getTerm('system')).toBe('System');
    expect(getTerm('system', { plural: true })).toBe('Systems');
    expect(getTerm('system', { lowercase: true })).toBe('system');
    expect(getTerm('system', { plural: true, lowercase: true })).toBe(
      'systems',
    );
  });
});

describe('pluralizeTerm', () => {
  it('pluralizeTerm returns the correct pluralized term', () => {
    expect(pluralizeTerm(1, 'system')).toBe('1 system');
    expect(pluralizeTerm(4, 'system')).toBe('4 systems');
  });
});
