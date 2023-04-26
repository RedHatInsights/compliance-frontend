import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Routes from './Routes';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import './App.scss';
import { useSetFlagsFromUrl } from 'Utilities/hooks/useFeature';

const App = (props) => {
  const location = useLocation();
  const chrome = useChrome();

  useSetFlagsFromUrl();
  useEffect(() => {
    chrome.hideGlobalFilter();

    const baseComponentUrl = location.pathname.split('/')[1] || 'reports';
    const unregister = chrome.on('APP_NAVIGATION', (event) => {
      if (event.domEvent) {
        chrome.appNavClick({ id: baseComponentUrl });
      }
    });

    return () => unregister();
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
