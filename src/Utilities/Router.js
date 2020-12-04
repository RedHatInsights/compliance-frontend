import React, { Fragment, Suspense } from 'react';
import propTypes from 'prop-types';
import { Route, Switch, Redirect, useHistory, useLocation } from 'react-router-dom';
import some from 'lodash/some';

const Router = ({ routes }) => {
    const location = useLocation();
    const background = location?.state?.background;
    const path = location.pathname;
    const fullPageRoutes = routes.filter((route) => (!route.modal));
    const modalRoutes = routes.filter((route) => (route.modal));
    const paths = routes.map((route) => (route.path));

    return <Suspense fallback={ Fragment }>
        <Switch location={ background || location }>
            {
                fullPageRoutes.map((route) => (
                    <Route
                        key={ `fullpageroute-${ route.path.replace('/', '-')}` }
                        exact
                        path={ route.path }>
                        <route.component { ...route.props ? route.props : {} } />
                    </Route>
                ))
            }
            <Route render={() => (some(paths, p => p === path) ? null : <Redirect to='/reports' />)} />
        </Switch>

        {
            modalRoutes.map((route) => (
                <Route
                    exact
                    key={ `modalroute-${ route.path.replace('/', '-')}` }
                    path={ route.path }>
                    <route.component { ...route.props ? route.props : {} } />
                </Route>
            ))
        }

    </Suspense>;
};

Router.propTypes = {
    routes: propTypes.array
};

export const useLinkToBackground = (fallbackRoute) => {
    const location = useLocation();
    const history = useHistory();

    return (args) => {
        const background = location?.state?.background;

        history.push({
            pathname: background ? background.pathname : fallbackRoute,
            hash: background ? background.hash : undefined,
            ...args
        });
    };
};

export const useAnchor = (defaultAnchor = '') => {
    const location = useLocation();
    const hash = location.hash && location.hash.length > 0 ? location.hash : undefined;
    return (hash || defaultAnchor).replace('#', '');
};

export default Router;
