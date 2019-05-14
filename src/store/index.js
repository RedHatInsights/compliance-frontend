import { getRegistry } from '@red-hat-insights/insights-frontend-components';
import { notifications } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import promiseMiddleware from 'redux-promise-middleware';
import { reducer as form } from 'redux-form';

let registry;

export function init (...middleware) {
    registry = getRegistry({}, [
        promiseMiddleware(),
        ...middleware
    ]);

    registry.register({ form, notifications });
    return registry;
}

export function getStore () {
    return registry.getStore();
}

export function register (...args) {
    return registry.register(...args);
}
