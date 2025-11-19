import { validatorFor, disableEdit } from './helpers';

describe('validatorFor', () => {
  describe('Number validator', () => {
    const validator = validatorFor({
      value_type: 'number',
    });

    it('should return true if inputs are numbers or strings in numbers', () => {
      expect(
        [0, 1, 2, '3', 4, '5', '6'].every((num) => validator(num)),
      ).toBeTruthy();
    });

    it('should return false if inputs are strings and not numbers', () => {
      expect(validator('foo')).toBe(false);
    });
  });

  describe('Boolean validator', () => {
    const validator = validatorFor({
      value_type: 'boolean',
    });

    it('should return true for "true" and "false" strings', () => {
      expect(validator('true')).toBe(true);
      expect(validator('false')).toBe(true);
    });

    it('should return false for other strings', () => {
      expect(validator('foo')).toBe(false);
      expect(validator('1')).toBe(false);
      expect(validator('0')).toBe(false);
    });
  });

  describe('String validator', () => {
    const validator = validatorFor({
      value_type: 'string',
    });

    it('should return true for any string', () => {
      expect(validator('any string')).toBe(true);
      expect(validator('123')).toBe(true);
      expect(validator('')).toBe(true);
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
