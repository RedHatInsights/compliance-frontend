import { getRegistry } from '@red-hat-insights/insights-frontend-components';
import promiseMiddleware from 'redux-promise-middleware';

let registry;

export function init (...middleware) {
    registry = getRegistry({}, [
        promiseMiddleware(),
        ...middleware
    ]);

    //If you want to register all of your reducers, this is good place.
    return registry;
}

export function getStore () {
    return registry.getStore();
}

export function register (...args) {
    return registry.register(...args);
}
