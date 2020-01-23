import {
    validateFirstPage,
    validateSecondPage
} from './validate.js';

describe('validations', () => {
    it('expect not to validate the first page if benchmark or profile are not set', () => {
        expect(validateFirstPage(null, null)).toBe(false);
    });

    it('expect to validate the first page if benchmark and profile are set', () => {
        expect(validateFirstPage('a', 'b')).toBe(true);
    });

    it('expect not to validate the first page if one of benchmark and profile are not set', () => {
        expect(validateFirstPage('a', null)).toBe(false);
        expect(validateFirstPage(null, 'b')).toBe(false);
    });

    it('expect not to validate the second page if name or refId are not set', () => {
        expect(validateSecondPage(null, null)).toBe(false);
    });

    it('expect to validate the second page if name and refId are set', () => {
        expect(validateSecondPage('a', 'b')).toBe(true);
    });

    it('expect not to validate the second page if one of name and refId are not set', () => {
        expect(validateSecondPage('a', null)).toBe(false);
        expect(validateSecondPage(null, 'b')).toBe(false);
    });
});
