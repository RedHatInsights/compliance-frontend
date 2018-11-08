import ReducerRegistry from '@red-hat-insights/insights-frontend-components/Utilities/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
import { ProfileReducer } from './Reducers/ProfileStore';

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
        //ProfileStore: ProfileReducer //(state, action) => ({...state})
        ProfileReducer //(state, action) => ({...state})
    });

    return registry;
}

export function getStore () {
    return registry.getStore();
}

export function register (...args) {
    return registry.register(...args);
}
