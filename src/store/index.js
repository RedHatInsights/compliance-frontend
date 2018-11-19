import ReducerRegistry from '@red-hat-insights/insights-frontend-components/Utilities/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
import { PolicyReducer } from './Reducers/PolicyStore';
import { SystemReducer } from './Reducers/SystemStore';

let registry;

export function init (...middleware) {
    if (registry) {
        throw new Error('store already initialized');
    }

    registry = new ReducerRegistry({}, [
        promiseMiddleware(),
        ...middleware
    ]);

    //If you want to register all of your reducers, this is good place.
    registry.register({
        //PolicyStore: PolicyReducer //(state, action) => ({...state})
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
