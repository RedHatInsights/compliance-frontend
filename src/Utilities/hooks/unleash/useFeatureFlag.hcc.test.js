import { renderHook } from '@testing-library/react';
import { useFlag, useFlagsStatus } from '@unleash/proxy-client-react';
import useFeatureFlagHcc from './useFeatureFlag.hcc';

jest.mock('@unleash/proxy-client-react', () => ({
  useFlag: jest.fn(),
  useFlagsStatus: jest.fn(),
}));

describe('useFeatureFlagHcc', () => {
  it('returns undefined until Unleash flags are ready', () => {
    useFlagsStatus.mockReturnValue({ flagsReady: false });
    useFlag.mockReturnValue(true);

    const { result } = renderHook(() =>
      useFeatureFlagHcc('compliance.kessel_enabled'),
    );

    expect(result.current).toBeUndefined();
  });

  it('returns the Unleash value once flags are ready', () => {
    useFlagsStatus.mockReturnValue({ flagsReady: true });
    useFlag.mockReturnValue(true);

    const { result } = renderHook(() =>
      useFeatureFlagHcc('compliance.kessel_enabled'),
    );

    expect(useFlag).toHaveBeenCalledWith('compliance.kessel_enabled');
    expect(result.current).toBe(true);
  });
});
