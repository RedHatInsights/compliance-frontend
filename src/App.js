import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import Routes from './Routes';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
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
      <NotificationsPortal />
      <Routes childProps={props} />
    </RBACProvider>
  );
};

App.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default App;
