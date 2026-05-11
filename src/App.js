import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import { KESSEL_API_BASE_URL } from '@/constants';
import { getAppConfig } from '@/config/appConfig';
import { useComplianceChrome } from '@/platform/chrome/useComplianceChrome';
import { useFlagsStatus } from '@unleash/proxy-client-react';
import { Bullseye, Spinner } from '@patternfly/react-core';

import Routes from './Routes';
import './App.scss';

const queryClient = new QueryClient();

const App = (props) => {
  const appConfig = getAppConfig();
  const chrome = useComplianceChrome();
  const isKesselEnabled = useFeatureFlag('compliance.kessel_enabled');
  const { flagsReady } = useFlagsStatus();

  useEffect(() => {
    chrome.hideGlobalFilter(true);
  }, [chrome]);

  if (appConfig.features.unleash && !flagsReady) {
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
        <RBACProvider appName="compliance">
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
