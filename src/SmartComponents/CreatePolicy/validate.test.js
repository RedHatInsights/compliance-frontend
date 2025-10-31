import { validateSecurityGuidePage, validateDetailsPage } from './validate.js';

describe('validations', () => {
  it('expect not to validate the first page if OS major version or profile are not set', () => {
    expect(validateSecurityGuidePage(null, null)).toBe(false);
  });

  it('expect to validate the first page if OS major version and profile are set', () => {
    expect(validateSecurityGuidePage('a', 'b')).toBe(true);
  });

  it('expect not to validate the first page if one of OS major version and profile are not set', () => {
    expect(validateSecurityGuidePage('a', null)).toBe(false);
    expect(validateSecurityGuidePage(null, 'b')).toBe(false);
  });

  it('expect not to validate the second page if name or refId are not set', () => {
    expect(validateDetailsPage(null, null, 100, false, true)).toBe(false);
  });

  it('expect to validate the second page if name and refId are set', () => {
    expect(validateDetailsPage('a', 'b', 100, false, true)).toBe(true);
  });

  it('expect not to validate the second page if async error present', () => {
    expect(validateDetailsPage('a', 'b', 100, true, true)).toBe(false);
  });

  it('expect not to validate the second page if waiting on async request', () => {
    expect(validateDetailsPage('a', 'b', 100, false, false)).toBe(false);
  });

  it('expect not to validate the second page if threshold to high', () => {
    expect(validateDetailsPage('a', 'b', 300, false, true)).toBe(false);
  });

  it('expect not to validate the second page if one of name and refId are not set', () => {
    expect(validateDetailsPage('a', null, 100, false, true)).toBe(false);
    expect(validateDetailsPage(null, 'b', 100, false, true)).toBe(false);
  });
});
