import React, { useEffect, Suspense, Fragment } from 'react';
import propTypes from 'prop-types';
import {
  Route as ReactRoute,
  Switch,
  Redirect,
  useHistory,
  useLocation,
  matchPath,
} from 'react-router-dom';
import { WithPermission } from 'PresentationalComponents';
import useDocumentTitle from 'Utilities/hooks/useDocumentTitle';

const Route = (route) => {
  const {
    component: Component,
    modal,
    path,
    props = {},
    title,
    requiredPermissions,
  } = route;
  const location = useLocation();
  const setTitle = useDocumentTitle();
  const isCurrent = !!matchPath(location.pathname, { path, exact: true });
  const requiresTitleEntity = title.includes('$entityTitle');
  const routeProps = {
    exact: true,
    key: `${!modal ? 'fullpage' : 'modal'}-route-${path.replace('/', '-')}`,
    path,
  };
  const componentProps = {
    ...props,
    route: { ...route, isCurrent, setTitle },
  };

  useEffect(() => {
    isCurrent && !requiresTitleEntity && setTitle(title);
  });

  return (
    <ReactRoute {...routeProps}>
      {requiredPermissions ? (
        <WithPermission requiredPermissions={requiredPermissions}>
          <Component {...componentProps} />
        </WithPermission>
      ) : (
        <Component {...componentProps} />
      )}
    </ReactRoute>
  );
};

Route.propTypes = {
  component: propTypes.node,
  modal: propTypes.bool,
  path: propTypes.string,
  props: propTypes.object,
  title: propTypes.string,
  requiredPermissions: propTypes.array,
};

const Router = ({ routes }) => {
  const location = useLocation();
  const background = location?.state?.background;
  const path = location.pathname;
  const fullPageRoutes = routes.filter((route) => !route.modal);
  const modalRoutes = routes.filter((route) => route.modal);
  const paths = routes.map((route) => route.path);
  const defaultRedirectRender = () =>
    paths.some((p) => p === path) ? null : <Redirect to="/reports" />;

  return (
    <Suspense fallback={Fragment}>
      <Switch location={background || location}>
        {fullPageRoutes.map(Route)}
        <ReactRoute render={defaultRedirectRender} />
      </Switch>

      {modalRoutes.map(Route)}
    </Suspense>
  );
};

Router.propTypes = {
  routes: propTypes.array,
};

export const useLinkToBackground = (fallbackRoute) => {
  const location = useLocation();
  const history = useHistory();

  return (args) => {
    const background = location?.state?.background;

    history.push({
      pathname: background ? background.pathname : fallbackRoute,
      hash: background ? background.hash : undefined,
      ...args,
    });
  };
};

export const useAnchor = (defaultAnchor = '') => {
  const location = useLocation();
  const hash =
    location.hash && location.hash.length > 0 ? location.hash : undefined;
  return (hash || defaultAnchor).replace('#', '');
};

export default Router;
