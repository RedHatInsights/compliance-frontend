import {
    validateFirstPage,
    validateSecondPage
} from './validate.js';

describe('validations', () => {
    it('expect not to validate the first page if benchmark or profile are not set', () => {
        expect(validateFirstPage(null, null)).toBe(false);
    });

    it('expect to validate the first page if benchmark and profile are set', () => {
        expect(validateFirstPage('a', 'b', 'c')).toBe(true);
    });

    it('expect not to validate the first page if one of benchmark and profile are not set', () => {
        expect(validateFirstPage('a', null)).toBe(false);
        expect(validateFirstPage(null, 'b')).toBe(false);
    });

    it('expect not to validate the second page if name or refId are not set', () => {
        expect(validateSecondPage(null, null, 100)).toBe(false);
    });

    it('expect to validate the second page if name and refId are set', () => {
        expect(validateSecondPage('a', 'b', 100)).toBe(true);
    });

    it('expect not to validate the second page if threshold to high', () => {
        expect(validateSecondPage('a', 'b', 300)).toBe(false);
    });

    it('expect not to validate the second page if one of name and refId are not set', () => {
        expect(validateSecondPage('a', null, 100)).toBe(false);
        expect(validateSecondPage(null, 'b', 100)).toBe(false);
    });
});
