import Immutable from 'seamless-immutable';
import * as ActionTypes from '../ActionTypes';

// eslint-disable-next-line new-cap
const initialState = Immutable({
    profilesList: {
        isLoading: true,
        items: []
    }
});

export const ProfileReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case ActionTypes.FETCH_COMPLIANCE_PROFILES + '_PENDING':
            return Immutable.setIn(state, ['profilesList', 'isLoading'], true);

        case ActionTypes.FETCH_COMPLIANCE_PROFILES + '_FULFILLED':
            newState = Immutable.setIn(state, ['profilesList', 'items'], action.payload.data);
            newState = Immutable.setIn(newState, ['profilesList', 'isLoading'], false);
            return newState;

        default:
            return state;
    }
};
