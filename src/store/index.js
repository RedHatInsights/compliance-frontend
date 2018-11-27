import { getRegistry } from '@red-hat-insights/insights-frontend-components';
import promiseMiddleware from 'redux-promise-middleware';
import { PolicyReducer } from './Reducers/PolicyStore';
import { SystemReducer } from './Reducers/SystemStore';

let registry;

export function init (...middleware) {
    registry = getRegistry({}, [
        promiseMiddleware(),
        ...middleware
    ]);

    //If you want to register all of your reducers, this is good place.
    registry.register({
        PolicyReducer, //(state, action) => ({...state})
        SystemReducer //(state, action) => ({...state})
    });

    return registry;
}

export function getStore () {
    return registry.getStore();
}

export function register (...args) {
    return registry.register(...args);
}
