import { uniq, sortingByProp } from './helpers';

describe('uniq', () => {
    it('should deduplicate items', () => {
        let result = uniq(['a', 'b', 'b', 'c']);
        expect(result.sort()).toEqual(['a', 'b', 'c']);
    });
});

describe('sortingByProp', () => {
    it('should sort string properties', () => {
        const input = [
            { prop: 'c' },
            { prop: 'd' },
            { prop: 'a' }
        ];
        expect(input.sort(sortingByProp('prop'))).toEqual([
            { prop: 'a' },
            { prop: 'c' },
            { prop: 'd' }
        ]);
    });

    it('should sort string properties descending', () => {
        const input = [
            { prop: 'c' },
            { prop: 'd' },
            { prop: 'a' }
        ];
        expect(input.sort(sortingByProp('prop', 'desc'))).toEqual([
            { prop: 'd' },
            { prop: 'c' },
            { prop: 'a' }
        ]);
    });

    it('should sort nubmer poperties', () => {
        const input = [
            { prop: 10 },
            { prop: 1 },
            { prop: 0 }
        ];
        expect(input.sort(sortingByProp('prop'))).toEqual([
            { prop: 0 },
            { prop: 1 },
            { prop: 10 }
        ]);
    });

    it('should sort with a missing poperty', () => {
        const input = [
            { prop: 'c' },
            { otherProp: 'z' },
            { prop: 'd' },
            { prop: 'a' }
        ];
        expect(input.sort(sortingByProp('prop'))).toEqual([
            { otherProp: 'z' },
            { prop: 'a' },
            { prop: 'c' },
            { prop: 'd' }
        ]);
    });

    it('should sort with a null item', () => {
        const input = [
            { prop: 'c' },
            null,
            { prop: 'd' },
            { prop: 'a' }
        ];
        expect(input.sort(sortingByProp('prop'))).toEqual([
            null,
            { prop: 'a' },
            { prop: 'c' },
            { prop: 'd' }
        ]);
    });
});
