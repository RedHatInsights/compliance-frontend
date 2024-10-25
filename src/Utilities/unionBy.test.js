import unionBy from './unionBy';

describe('unionBy', () => {
  it('union of basic array with string identifier', () => {
    expect(unionBy([{ id: 1 }, { id: 2 }], [{ id: 3 }], 'id')).toStrictEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  });

  it('union of basic array with func identifier', () => {
    expect(
      unionBy([{ id: 1 }, { id: 2 }], [{ id: 3 }], (item) => item.id)
    ).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('union of an empty and non-empty arrays', () => {
    expect(unionBy([], [{ id: 3 }], 'id')).toStrictEqual([{ id: 3 }]);
  });

  it('union of two empty arrays', () => {
    expect(unionBy([], [], 'id')).toStrictEqual([]);
  });

  it('union of two arrays with the same item', () => {
    expect(unionBy([{ id: 1 }, { id: 2 }], [{ id: 2 }], 'id')).toStrictEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });

  it('union of just one array', () => {
    expect(unionBy([{ id: 1 }, { id: 2 }], 'id')).toStrictEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });
});
