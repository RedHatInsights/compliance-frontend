import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import promiseMiddleware from 'redux-promise-middleware';
import { reducer as form } from 'redux-form';
import { compose } from 'redux';
import logger from 'redux-logger';

let registry;

export function init(environment) {
  registry = getRegistry(
    {},
    [promiseMiddleware, ...(environment === 'development' ? [logger] : [])],
    environment === 'development' && typeof window !== 'undefined'
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose
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
