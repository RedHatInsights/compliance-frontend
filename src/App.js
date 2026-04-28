import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import EnvironmentProvider, {
  useEnvironment,
} from 'Utilities/EnvironmentProvider';

import Routes from './Routes';
import './App.scss';

const queryClient = new QueryClient();

const AppContent = ({ childProps }) => {
  const { hideGlobalFilter } = useEnvironment();

  useEffect(() => {
    hideGlobalFilter(true);
  }, [hideGlobalFilter]);

  return (
    <NotificationsProvider>
      <Routes childProps={childProps} />
    </NotificationsProvider>
  );
};

AppContent.propTypes = {
  childProps: PropTypes.object,
};

const App = (props) => (
  <QueryClientProvider client={queryClient}>
    <EnvironmentProvider>
      <AppContent childProps={props} />
    </EnvironmentProvider>
  </QueryClientProvider>
);

App.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default App;
