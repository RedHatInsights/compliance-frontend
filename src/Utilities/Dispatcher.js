import { getStore } from '../store';
export function dispatchAction(actionCreator) {
    const store = getStore();
    return store.dispatch(actionCreator);
}
