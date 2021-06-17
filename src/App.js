import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/RouterParams';
import { Routes } from './Routes';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import './App.scss';
import { useSetFlagsFromUrl } from 'Utilities/hooks/useFeature';

const appNavClick = {
  reports(redirect) {
    insights.chrome.appNavClick({ id: 'reports', redirect });
  },
  scappolicies(redirect) {
    insights.chrome.appNavClick({ id: 'scappolicies', redirect });
  },
  systems(redirect) {
    insights.chrome.appNavClick({ id: 'systems', redirect });
  },
};

const App = (props) => {
  useSetFlagsFromUrl();
  useEffect(() => {
    insights.chrome.init();
    insights.chrome?.hideGlobalFilter?.();
    insights.chrome.identifyApp('compliance');
    const baseComponentUrl = props.location.pathname.split('/')[1] || 'reports';
    const unregister = insights.chrome.on('APP_NAVIGATION', (event) => {
      if (event.domEvent) {
        props.history.push(`/${event.navId}`);
        appNavClick[baseComponentUrl](true);
      }
    });

    return () => unregister();
  }, []);

  return (
    <React.Fragment>
      <NotificationsPortal />
      <Routes childProps={props} />
    </React.Fragment>
  );
};

App.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default routerParams(App);
