import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import promiseMiddleware from 'redux-promise-middleware';
import { reducer as form } from 'redux-form';

let registry;

export function init(...middleware) {
  registry = getRegistry({}, [
    promiseMiddleware,
    ...middleware.filter((item) => typeof item !== 'undefined'),
  ]);

  registry.register({ form, notifications: notificationsReducer });
  return registry;
}

export function getStore() {
  return registry.getStore();
}

export function register(...args) {
  return registry.register(...args);
}
