import Immutable from 'seamless-immutable';
import * as ActionTypes from '../ActionTypes';

// eslint-disable-next-line new-cap
const initialState = Immutable({
    systemsList: {
        isLoading: true,
        items: []
    }
});

export const SystemReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case ActionTypes.FETCH_COMPLIANCE_SYSTEMS + '_PENDING':
            return Immutable.setIn(state, ['systemsList', 'isLoading'], true);

        case ActionTypes.FETCH_COMPLIANCE_SYSTEMS + '_FULFILLED':
            newState = Immutable.setIn(state, ['systemsList', 'items'], action.payload.data);
            newState = Immutable.setIn(newState, ['systemsList', 'isLoading'], false);
            return newState;

        default:
            return state;
    }
};
