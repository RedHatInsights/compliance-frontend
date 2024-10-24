import {
  camelCase,
  getProperty,
  uniq,
  sortingByProp,
  orderByArray,
  buildOSObject,
} from './helpers';
import items, {
  severityLevels,
} from './hooks/useTableTools/__fixtures__/items';

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

describe('orderByArray', () => {
  const exampleItems = items(10);

  it('sorts an array asc', () => {
    expect(
      orderByArray(exampleItems, 'severity', severityLevels, 'asc')
    ).toMatchSnapshot();
  });

  it('sorts an array desc', () => {
    expect(
      orderByArray(exampleItems, 'severity', severityLevels, 'desc')
    ).toMatchSnapshot();
  });
});

describe('camelCase', () => {
  it('should camelCase a string', () => {
    expect(camelCase('TESTCase')).toMatchSnapshot();
    expect(camelCase('testCase')).toMatchSnapshot();
    expect(camelCase('test-Case')).toMatchSnapshot();
    expect(camelCase('test_Case')).toMatchSnapshot();
    expect(camelCase('Test Case With Multiple Words')).toMatchSnapshot();
  });
});

describe('getPropery', () => {
  const object = {
    level1: {
      level2: {
        level3: {
          value: 'value-level-3',
        },
        value: 'value-level-2',
      },
    },
  };

  it('should return values of keys', () => {
    expect(getProperty(object, 'level1.level2.level3.value')).toMatchSnapshot();
    expect(getProperty(object, 'level1.level2.value')).toMatchSnapshot();
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
