import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { getAppConfig } from '@/config/appConfig';
import { IOP_COMPLIANCE_NAVIGATE } from './constants';
import { getForemanSyncRoute } from './iopForemanSyncRoute';

import { useIopChromeContext } from './IopChromeContext';

/**
 * Syncs the Foreman browser URL to the current iframe *page* (not modals).
 * Modal routes only change the hash inside the iframe.
 */
const useIopNavigationSync = () => {
  const location = useLocation();
  const { chromeReady, embedded } = useIopChromeContext();
  const lastPostedRouteRef = useRef(null);

  useEffect(() => {
    if (!chromeReady || getAppConfig().envTarget !== 'iop') {
      return undefined;
    }

    // host details Compliance tab owns the Foreman URL
    if (embedded === 'host-tab') {
      return undefined;
    }

    if (typeof window === 'undefined' || window.parent === window) {
      return undefined;
    }

    const appRoute = getForemanSyncRoute(location.pathname);

    if (!appRoute || appRoute === lastPostedRouteRef.current) {
      return undefined;
    }

    lastPostedRouteRef.current = appRoute;

    window.parent.postMessage(
      {
        type: IOP_COMPLIANCE_NAVIGATE,
        payload: { appRoute },
      },
      window.location.origin,
    );

    return undefined;
  }, [chromeReady, embedded, location.pathname]);
};

export default useIopNavigationSync;
export { useIopNavigationSync };
