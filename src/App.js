import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { Routes } from './Routes';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import '@redhat-cloud-services/frontend-components-notifications/index.css';
import './App.scss';

const App = (props) => {
    const appNavClick = {
        reports(redirect) { insights.chrome.appNavClick({ id: 'reports', redirect }); },
        scappolicies(redirect) { insights.chrome.appNavClick({ id: 'scappolicies', redirect }); },
        systems(redirect) { insights.chrome.appNavClick({ id: 'systems', redirect }); }
    };

    useEffect(() => {
        insights.chrome.init();
        insights.chrome.identifyApp('compliance');
        const baseComponentUrl = props.location.pathname.split('/')[1] || 'reports';
        const unregister = insights.chrome.on('APP_NAVIGATION', event => {
            if (event.domEvent) {
                props.history.push(`/${event.navId}`);
                appNavClick[baseComponentUrl](true);
            }
        });

        return () => unregister();
    }, []);

    useEffect(() => {
        const baseComponentUrl = props.location.pathname.split('/')[1] || 'reports';
        insights && insights.chrome && baseComponentUrl && appNavClick[baseComponentUrl](false);
    }, [appNavClick, props.location]);

    return (
        <React.Fragment>
            <NotificationsPortal />
            <Routes childProps={props} />
        </React.Fragment>
    );
};

App.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object
};

export default routerParams(App);
