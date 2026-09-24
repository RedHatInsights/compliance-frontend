import { useEffect, useRef } from 'react';

import { IOP_IFRAME_HEIGHT } from './constants';
import { measureIopContentHeight } from './measureIopContentHeight';

/**
 * Host-tab only: post the iframe content height so Foreman can size the iframe
 * and keep a single page scrollbar.
 *  @param embedded
 */
export const useIopIframeHeightReporter = (embedded) => {
  const lastHeightRef = useRef(null);

  useEffect(() => {
    if (embedded !== 'host-tab' || window.parent === window) {
      return undefined;
    }

    const publish = (height) => {
      lastHeightRef.current = height;
      window.parent.postMessage(
        { type: IOP_IFRAME_HEIGHT, payload: { height } },
        window.location.origin,
      );
    };

    const reportHeight = () => {
      const height = measureIopContentHeight();

      if (!height || lastHeightRef.current === height) {
        return;
      }

      publish(height);
    };

    const root = document.getElementById('root');
    const resizeObserver = new ResizeObserver(reportHeight);
    const mutationObserver = new MutationObserver(reportHeight);

    if (root) {
      resizeObserver.observe(root);
      mutationObserver.observe(root, { childList: true, subtree: true });
    }

    reportHeight();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      lastHeightRef.current = null;
    };
  }, [embedded]);
};
