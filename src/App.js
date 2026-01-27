import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import { KESSEL_API_BASE_URL } from '@/constants';

import Routes from './Routes';
import './App.scss';

const queryClient = new QueryClient();

const App = (props) => {
  const chrome = useChrome();
  const isKesselEnabled = useFeatureFlag('compliance.kessel_enabled');

  useEffect(() => {
    chrome.hideGlobalFilter(true);
  }, [chrome]);

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
