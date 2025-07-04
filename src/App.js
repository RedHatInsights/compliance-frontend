import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import Routes from './Routes';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import './App.scss';

const App = (props) => {
  const chrome = useChrome();

  useEffect(() => {
    chrome.hideGlobalFilter();
  }, []);

  return (
    <RBACProvider appName="compliance">
      <NotificationsProvider>
        <Routes childProps={props} />
      </NotificationsProvider>
    </RBACProvider>
  );
};

App.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default App;
