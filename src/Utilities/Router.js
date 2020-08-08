import React from 'react';
import propTypes from 'prop-types';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import some from 'lodash/some';

const Router = ({ routes }) => {
    const location = useLocation();
    const background = location.state && location.state.background;
    const path = location.pathname;
    const fullPageRoutes = routes.filter((route) => (!route.modal));
    const modalRoutes = routes.filter((route) => (route.modal));
    const paths = routes.map((route) => (route.path));

    return <React.Fragment>
        <Switch location={ background || location }>
            {
                fullPageRoutes.map((route) => (
                    <Route
                        key={ `fullpageroute-${ route.path.replace('/', '')}` }
                        exact
                        path={ route.path }>
                        <route.component { ...route.props ? route.props : {} } />
                    </Route>
                ))
            }
            <Route render={() => (some(paths, p => p === path) ? null : <Redirect to='/reports' />)} />
        </Switch>

        {
            background && modalRoutes.map((route) => (
                <Route
                    exact
                    key={ `modalroute-${ route.path.replace('/', '')}` }
                    path={ route.path }>
                    <route.component { ...route.props ? route.props : {} } />
                </Route>
            ))
        }

    </React.Fragment>;
};

Router.propTypes = {
    routes: propTypes.array
};

export default Router;
