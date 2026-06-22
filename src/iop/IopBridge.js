import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ScalprumProvider } from '@scalprum/react-core';
import { Bullseye, Spinner } from '@patternfly/react-core';

import { IOP_CHROME_INIT, IOP_COMPLIANCE_READY } from './constants';
import { createIopProviderOptions } from './createIopProviderOptions';

const normalizeAppRoute = (appRoute = '') =>
  `/${String(appRoute).replace(/^\/+/, '')}`;

/**
 * Listens for Foreman postMessage, wires Scalprum chrome/RBAC, navigates to the requested route.
 */
const IopBridge = ({ children }) => {
  const navigate = useNavigate();
  const [providerOptions, setProviderOptions] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type !== IOP_CHROME_INIT) {
        return;
      }

      const { appRoute, ...payload } = event.data.payload || {};
      setProviderOptions(createIopProviderOptions(payload));

      if (appRoute) {
        navigate(normalizeAppRoute(appRoute));
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
    <ScalprumProvider {...providerOptions}>{children}</ScalprumProvider>
  );
};

IopBridge.propTypes = {
  children: PropTypes.node,
};

export default IopBridge;
