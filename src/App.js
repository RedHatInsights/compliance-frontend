import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import Routes from './Routes';
import './App.scss';

const queryClient = new QueryClient();

const App = (props) => {
  const chrome = useChrome();

  useEffect(() => {
    chrome.hideGlobalFilter();
  }, [chrome]);

  return (
    <QueryClientProvider client={queryClient}>
      <RBACProvider appName="compliance">
        <NotificationsProvider>
          <Routes childProps={props} />
        </NotificationsProvider>
      </RBACProvider>
    </QueryClientProvider>
  );
};

App.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default App;
