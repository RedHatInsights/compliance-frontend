import { renderHook } from '@testing-library/react';

import { IOP_IFRAME_HEIGHT } from './constants';
import { useIopIframeHeightReporter } from './useIopIframeHeightReporter';

jest.mock('./measureIopContentHeight', () => ({
  measureIopContentHeight: jest.fn(() => 1600),
}));

const { measureIopContentHeight } = require('./measureIopContentHeight');

describe('useIopIframeHeightReporter', () => {
  let postMessage;
  const resizeObservers = [];
  const mutationObservers = [];

  beforeEach(() => {
    postMessage = jest.fn();
    resizeObservers.length = 0;
    mutationObservers.length = 0;
    measureIopContentHeight.mockReturnValue(1600);

    Object.defineProperty(window, 'parent', {
      configurable: true,
      value: { postMessage },
    });

    class MockResizeObserver {
      constructor(callback) {
        this.callback = callback;
        resizeObservers.push(this);
      }

      observe() {}

      disconnect() {
        this.disconnected = true;
      }
    }

    class MockMutationObserver {
      constructor(callback) {
        this.callback = callback;
        mutationObservers.push(this);
      }

      observe() {}

      disconnect() {
        this.disconnected = true;
      }
    }

    window.ResizeObserver = MockResizeObserver;
    window.MutationObserver = MockMutationObserver;
  });

  afterEach(() => {
    Object.defineProperty(window, 'parent', {
      configurable: true,
      value: window,
    });
    delete window.ResizeObserver;
    delete window.MutationObserver;
    document.documentElement.classList.remove('iop-embedded-host-tab');
    jest.restoreAllMocks();
  });

  it('does not post when not embedded as host-tab', () => {
    renderHook(() => useIopIframeHeightReporter(null));

    expect(postMessage).not.toHaveBeenCalled();
  });

  it('posts content height to the parent', () => {
    renderHook(() => useIopIframeHeightReporter('host-tab'));

    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith(
      { type: IOP_IFRAME_HEIGHT, payload: { height: 1600 } },
      window.location.origin,
    );
  });

  it('posts again when observed content height changes', () => {
    renderHook(() => useIopIframeHeightReporter('host-tab'));
    postMessage.mockClear();
    measureIopContentHeight.mockReturnValue(2100);

    resizeObservers[0].callback();

    expect(postMessage).toHaveBeenCalledWith(
      { type: IOP_IFRAME_HEIGHT, payload: { height: 2100 } },
      window.location.origin,
    );
  });

  it('posts again when the DOM mutates after the first paint', () => {
    renderHook(() => useIopIframeHeightReporter('host-tab'));
    postMessage.mockClear();
    measureIopContentHeight.mockReturnValue(2400);

    mutationObservers[0].callback();

    expect(postMessage).toHaveBeenCalledWith(
      { type: IOP_IFRAME_HEIGHT, payload: { height: 2400 } },
      window.location.origin,
    );
  });

  it('does not repost the same height', () => {
    renderHook(() => useIopIframeHeightReporter('host-tab'));
    postMessage.mockClear();

    resizeObservers[0].callback();

    expect(postMessage).not.toHaveBeenCalled();
  });

  it('disconnects observers on unmount', () => {
    const { unmount } = renderHook(() =>
      useIopIframeHeightReporter('host-tab'),
    );

    unmount();

    expect(resizeObservers[0].disconnected).toBe(true);
    expect(mutationObservers[0].disconnected).toBe(true);
  });
});
