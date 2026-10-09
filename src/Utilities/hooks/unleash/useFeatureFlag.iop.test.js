import { renderHook } from '@testing-library/react';
import useFeatureFlagIop from './useFeatureFlag.iop';

describe('useFeatureFlagIop', () => {
  it('returns the static IoP value without waiting for Unleash', () => {
    const { result } = renderHook(() =>
      useFeatureFlagIop('compliance.kessel_enabled'),
    );

    expect(result.current).toBe(false);
  });

  it('returns false for an unknown flag', () => {
    const { result } = renderHook(() =>
      useFeatureFlagIop('compliance.unknown'),
    );

    expect(result.current).toBe(false);
  });
});
