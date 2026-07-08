import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScalprumProvider } from '@scalprum/react-core';
import { Bullseye, Spinner } from '@patternfly/react-core';

import { IOP_CHROME_INIT, IOP_COMPLIANCE_READY } from './constants';
import { createIopProviderOptions } from './createIopProviderOptions';
import { IopChromeContext } from './IopChromeContext';
import { isIframeModalRoute } from './iopForemanSyncRoute';

const normalizeAppRoute = (appRoute = '') =>
  `/${String(appRoute).replace(/^\/+/, '')}`;

/**
 * Listens for Foreman postMessage, wires Scalprum chrome/RBAC, navigates to the requested route.
 */
const IopBridge = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location.pathname);
  const lastParentAppRouteRef = useRef(null);
  const [providerOptions, setProviderOptions] = useState(null);
  const [permissionsEpoch, setPermissionsEpoch] = useState(0);
  const [chromeReady, setChromeReady] = useState(false);
  const lastPermissionsKeyRef = useRef('');

  locationRef.current = location.pathname;

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type !== IOP_CHROME_INIT) {
        return;
      }

      const { appRoute, ...payload } = event.data.payload || {};
      const permissionsKey = JSON.stringify(payload.permissions || []);

      if (permissionsKey !== lastPermissionsKeyRef.current) {
        lastPermissionsKeyRef.current = permissionsKey;
        setPermissionsEpoch((current) => current + 1);
        setProviderOptions(createIopProviderOptions(payload));
      } else {
        createIopProviderOptions(payload);
      }

      setChromeReady(true);

      if (!appRoute || appRoute === lastParentAppRouteRef.current) {
        return;
      }

      if (isIframeModalRoute(locationRef.current)) {
        return;
      }

      lastParentAppRouteRef.current = appRoute;

      const target = normalizeAppRoute(appRoute);
      if (locationRef.current !== target) {
        navigate(target);
      }
    };

    window.addEventListener('message', handleMessage);

    if (window.parent !== window) {
      window.parent.postMessage(
        { type: IOP_COMPLIANCE_READY },
        window.location.origin,
      );
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => {
      setProviderOptions(
        (current) => current || createIopProviderOptions({ permissions: [] }),
      );
    }, 2000);

    return () => window.clearTimeout(fallbackTimer);
  }, []);

  if (!providerOptions) {
    return (
      <Bullseye>
        <Spinner size="xl" />
      </Bullseye>
    );
  }

  return (
    <IopChromeContext.Provider value={{ permissionsEpoch, chromeReady }}>
      <ScalprumProvider {...providerOptions}>{children}</ScalprumProvider>
    </IopChromeContext.Provider>
  );
};

IopBridge.propTypes = {
  children: PropTypes.node,
};

export default IopBridge;
