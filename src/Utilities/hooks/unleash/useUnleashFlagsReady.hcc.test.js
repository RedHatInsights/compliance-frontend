import { renderHook } from '@testing-library/react';
import { useFlagsStatus } from '@unleash/proxy-client-react';
import useUnleashFlagsReadyHcc from './useUnleashFlagsReady.hcc';

jest.mock('@unleash/proxy-client-react', () => ({
  useFlagsStatus: jest.fn(),
}));

describe('useUnleashFlagsReadyHcc', () => {
  it('follows the Unleash client readiness', () => {
    useFlagsStatus.mockReturnValue({ flagsReady: false });

    const { result, rerender } = renderHook(() => useUnleashFlagsReadyHcc());

    expect(result.current).toBe(false);

    useFlagsStatus.mockReturnValue({ flagsReady: true });
    rerender();

    expect(result.current).toBe(true);
  });
});
