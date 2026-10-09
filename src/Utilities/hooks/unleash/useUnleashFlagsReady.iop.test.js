import { renderHook } from '@testing-library/react';
import useUnleashFlagsReadyIop from './useUnleashFlagsReady.iop';

describe('useUnleashFlagsReadyIop', () => {
  it('is ready without an Unleash client', () => {
    const { result } = renderHook(() => useUnleashFlagsReadyIop());

    expect(result.current).toBe(true);
  });
});
