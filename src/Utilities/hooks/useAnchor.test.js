import { renderHook } from '@testing-library/react';
import { useAnchor } from './useAnchor';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

const { useLocation } = require('react-router-dom');

describe('useAnchor', () => {
  it('returns default when hash is QuickStart-style (#state=...) and no tab was selected before', () => {
    useLocation.mockReturnValue({
      pathname:
        '/insights/compliance/scappolicies/123?quickstart=getting-started',
      hash: '#state=12345',
      state: {},
    });
    const { result } = renderHook(() => useAnchor('details'));
    expect(result.current).toBe('details');
  });

  it('keeps returning last tab when platform overwrites hash with #state=...', () => {
    const pathname =
      '/insights/compliance/scappolicies/123?quickstart=getting-started';

    useLocation.mockReturnValue({ pathname, hash: '#rules', state: {} });
    const { result, rerender } = renderHook(() => useAnchor('details'));
    expect(result.current).toBe('rules');

    useLocation.mockReturnValue({
      pathname,
      hash: '#state=12345',
      state: {},
    });
    rerender();
    expect(result.current).toBe('rules');
  });
});
