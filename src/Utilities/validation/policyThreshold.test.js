import { hasMaxDecimals, thresholdValid } from './policyThreshold';

describe('hasMaxDecimals', () => {
  it('allows up to the given number of decimal places', () => {
    expect(hasMaxDecimals(50, 1)).toBe(true);
    expect(hasMaxDecimals(50.5, 1)).toBe(true);
    expect(hasMaxDecimals(50.55, 1)).toBe(false);
  });
});

describe('thresholdValid', () => {
  it('accepts values between 0 and 100 with at most one decimal', () => {
    expect(thresholdValid('0')).toBe(true);
    expect(thresholdValid('100')).toBe(true);
    expect(thresholdValid('50.5')).toBe(true);
  });

  it('rejects out-of-range values', () => {
    expect(thresholdValid('-1')).toBe(false);
    expect(thresholdValid('101')).toBe(false);
  });

  it('rejects too many decimal places', () => {
    expect(thresholdValid('50.55')).toBe(false);
  });
});
