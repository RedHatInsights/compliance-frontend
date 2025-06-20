import { validatorFor, disableEdit } from './helpers';

describe('validatorFor', () => {
  describe('Number validator', () => {
    const validator = validatorFor({
      type: 'number',
    });

    it('should return true if inputs are numbers or strings in numbers', () => {
      expect(
        [0, 1, 2, '3', 4, '5', '6'].every((num) => validator(num)),
      ).toBeTruthy();
    });

    it('should return false if inputs are strings and not numbers', () => {
      expect(['blub', 'blob', 'blab'].every((num) => validator(num))).toBe(
        false,
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
