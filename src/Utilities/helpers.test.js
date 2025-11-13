import {
  uniq,
  sortingByProp,
  buildOSObject,
  capitalizeWord,
  stringToSentenceCase,
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

describe('buildOSObject', () => {
  const osArray = ['6.9', '7.8'];

  it('should build an array of OS objects', () => {
    const result = buildOSObject(osArray);
    expect(result).toEqual([
      { count: 0, value: { major: '6', minor: '9', name: 'RHEL' } },
      { count: 0, value: { major: '7', minor: '8', name: 'RHEL' } },
    ]);
  });

  it('should ignore invalid input', () => {
    const result = buildOSObject([...osArray, null, undefined, 7.8]);
    expect(result).toEqual([
      { count: 0, value: { major: '6', minor: '9', name: 'RHEL' } },
      { count: 0, value: { major: '7', minor: '8', name: 'RHEL' } },
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
