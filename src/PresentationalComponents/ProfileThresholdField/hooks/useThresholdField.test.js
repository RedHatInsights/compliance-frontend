import { renderHook, act } from '@testing-library/react';
import useThresholdField from './useThresholdField';

describe('useThresholdField', () => {
  it('validates a threshold on change', () => {
    const threshold = 10;
    const { result } = renderHook(() => useThresholdField(threshold));

    expect(result.current.threshold).toEqual(threshold);

    act(() => {
      result.current.onThresholdChange(20);
    });
    expect(result.current.threshold).toEqual(20);
    expect(result.current.validThreshold).toBe(true);

    act(() => {
      result.current.onThresholdChange(50);
    });
    expect(result.current.threshold).toEqual(50);
    expect(result.current.validThreshold).toBe(true);

    act(() => {
      result.current.onThresholdChange(-50);
    });
    expect(result.current.threshold).toEqual(-50);
    expect(result.current.validThreshold).toBe(false);

    act(() => {
      result.current.onThresholdChange(110);
    });
    expect(result.current.threshold).toEqual(110);
    expect(result.current.validThreshold).toBe(false);
  });
});
