import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import Routes from './Routes';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import './App.scss';
import { useSetFlagsFromUrl } from 'Utilities/hooks/useFeature';

const App = (props) => {
  const chrome = useChrome();

  useSetFlagsFromUrl();
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
