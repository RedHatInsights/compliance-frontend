import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import promiseMiddleware from 'redux-promise-middleware';
import { reducer as form } from 'redux-form';
import { compose } from 'redux';

let registry;

export function init(...middleware) {
  registry = getRegistry(
    {},
    [
      promiseMiddleware,
      ...middleware.filter((item) => typeof item !== 'undefined'),
    ],
    (process.env.NODE_ENV !== 'production' &&
      typeof window !== 'undefined' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
      compose
  );

  registry.register({ form, notifications: notificationsReducer });
  return registry;
}

export function getStore() {
  return registry.getStore();
}

export function register(...args) {
  return registry.register(...args);
}
