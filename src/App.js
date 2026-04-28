import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import EnvironmentProvider, {
  useEnvironment,
} from 'Utilities/EnvironmentProvider';

import Routes from './Routes';
import './App.scss';

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
  <EnvironmentProvider>
    <AppContent childProps={props} />
  </EnvironmentProvider>
);

App.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default App;
