import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import useUnleashFlagsReady from 'Utilities/hooks/useUnleashFlagsReady';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import { KESSEL_API_BASE_URL } from '@/constants';
import { getAppConfig } from '@/config/appConfig';
import { useIopChromeContext } from '@/iop/IopChromeContext';
import { useIopNavigationSync } from '@/iop/useIopNavigationSync';
import { Bullseye, Spinner } from '@patternfly/react-core';

import Routes from './Routes';
import './App.scss';

const queryClient = new QueryClient();

const App = (props) => {
  const chrome = useChrome();
  const isKesselEnabled = useFeatureFlag('compliance.kessel_enabled');
  const flagsReady = useUnleashFlagsReady();
  const { permissionsEpoch } = useIopChromeContext();
  const isIop = getAppConfig().envTarget === 'iop';

  useIopNavigationSync();

  useEffect(() => {
    chrome.hideGlobalFilter(true);
  }, [chrome]);

  if (!flagsReady) {
    return (
      <Bullseye>
        <Spinner size="xl" />
      </Bullseye>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {isKesselEnabled ? (
        <AccessCheck.Provider
          baseUrl={window.location.origin}
          apiPath={KESSEL_API_BASE_URL}
        >
          <NotificationsProvider>
            <Routes childProps={props} />
          </NotificationsProvider>
        </AccessCheck.Provider>
      ) : (
        <RBACProvider
          key={isIop ? `iop-rbac-${permissionsEpoch}` : undefined}
          appName="compliance"
        >
          <NotificationsProvider>
            <Routes childProps={props} />
          </NotificationsProvider>
        </RBACProvider>
      )}
    </QueryClientProvider>
  );
};

App.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default App;
