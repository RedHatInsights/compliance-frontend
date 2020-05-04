import { getStore } from 'Store';

export function dispatchAction(actionCreator) {
    const store = getStore();
    return store.dispatch(actionCreator);
}
