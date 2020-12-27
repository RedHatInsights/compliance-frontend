import { useEffect, useMemo, useRef, useReducer } from 'react';
// Originally from https://staleclosures.dev/building-usereducer-with-logger/

const enchanceDispatchWithLogger = (dispatch) => (
    (action) => {
        console.group('action', action.type);
        console.log('Action:', action);

        return dispatch(action);
    }
);

const useReducerWithLogger = (...args) => {
    let prevState = useRef();
    const [state, dispatch] = useReducer(...args);

    const dispatchWithLogger = useMemo(() => (
        enchanceDispatchWithLogger(dispatch)
    ), [dispatch]);

    useEffect(() => {
        if (state !== prevState.current) {
            console.log('prev state: ', prevState.current);
            console.log('next state: ', state);
            console.groupEnd();
        }

        prevState.current = state;
    }, [state]);

    return [state, dispatchWithLogger];
};

export default useReducerWithLogger;
