import Immutable from 'seamless-immutable';
import * as ActionTypes from '../ActionTypes';

// eslint-disable-next-line new-cap
const initialState = Immutable({
    policiesList: {
        isLoading: true,
        items: []
    }
});

export const PolicyReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case ActionTypes.FETCH_COMPLIANCE_POLICIES + '_PENDING':
            return Immutable.setIn(state, ['policiesList', 'isLoading'], true);

        case ActionTypes.FETCH_COMPLIANCE_POLICIES + '_FULFILLED':
            newState = Immutable.setIn(state, ['policiesList', 'items'], action.payload.data);
            newState = Immutable.setIn(newState, ['policiesList', 'isLoading'], false);
            return newState;

        default:
            return state;
    }
};
