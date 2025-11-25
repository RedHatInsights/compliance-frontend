import { validatorFor, disableEdit } from './helpers';

describe('validatorFor', () => {
  describe('Number validation', () => {
    const valueDefinition = { value_type: 'number' };
    const validate = validatorFor(valueDefinition);

    it('should return valid true and no error message for valid numbers', () => {
      expect(validate('123')).toEqual({
        valid: true,
        errorMessage: null,
      });
      expect(validate('0')).toEqual({
        valid: true,
        errorMessage: null,
      });
    });

    it('should return valid false and error message for invalid values', () => {
      expect(validate('abc')).toEqual({
        valid: false,
        errorMessage: 'Value must be a number',
      });
      expect(validate('12.5')).toEqual({
        valid: false,
        errorMessage: 'Value must be a number',
      });
    });
  });

  describe('Boolean validation', () => {
    const valueDefinition = { value_type: 'boolean' };
    const validate = validatorFor(valueDefinition);

    it('should return valid true and no error message for valid booleans', () => {
      expect(validate('true')).toEqual({
        valid: true,
        errorMessage: null,
      });
      expect(validate('false')).toEqual({
        valid: true,
        errorMessage: null,
      });
    });

    it('should return valid false and error message for invalid values', () => {
      expect(validate('yes')).toEqual({
        valid: false,
        errorMessage: 'Value must be either "true" or "false"',
      });
    });
  });

  describe('String validation', () => {
    const valueDefinition = { value_type: 'string' };
    const validate = validatorFor(valueDefinition);

    it('should return valid true and no error message for any string', () => {
      expect(validate('any string')).toEqual({
        valid: true,
        errorMessage: null,
      });
      expect(validate('')).toEqual({
        valid: true,
        errorMessage: null,
      });
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
