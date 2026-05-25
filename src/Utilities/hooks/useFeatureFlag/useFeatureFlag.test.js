import { renderHook } from '@testing-library/react';
import { useFlag, useFlagsStatus } from '@unleash/proxy-client-react';

import useFeatureFlagHcc from './useFeatureFlag.hcc';
import useFeatureFlagIop from './useFeatureFlag.iop';

jest.mock('@unleash/proxy-client-react', () => ({
  useFlag: jest.fn(),
  useFlagsStatus: jest.fn(),
}));

describe('useFeatureFlag (HCC build)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns undefined until flags are ready', () => {
    useFlagsStatus.mockReturnValue({ flagsReady: false });
    useFlag.mockReturnValue(true);

    const { result } = renderHook(() =>
      useFeatureFlagHcc('compliance.kessel_enabled'),
    );

    expect(result.current).toBeUndefined();
  });

  it('returns flag value when flags are ready', () => {
    useFlagsStatus.mockReturnValue({ flagsReady: true });
    useFlag.mockReturnValue(true);

    const { result } = renderHook(() =>
      useFeatureFlagHcc('compliance.kessel_enabled'),
    );

    expect(result.current).toBe(true);
  });
});

describe('useFeatureFlag (IoP build)', () => {
  it('reads static bootstrap flags', () => {
    const { result } = renderHook(() =>
      useFeatureFlagIop('compliance.kessel_enabled'),
    );

    expect(result.current).toBe(false);
  });

  it('returns false for unknown flags', () => {
    const { result } = renderHook(() =>
      useFeatureFlagIop('compliance.unknown_flag'),
    );

    expect(result.current).toBe(false);
  });
});
