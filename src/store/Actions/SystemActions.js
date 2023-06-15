import * as ActionTypes from '../Types';

export const setDisabledSelection = (isDisabled) => {
  return {
    type: ActionTypes.SET_DISABLED_SYSTEM_SELECTION,
    payload: isDisabled,
  };
};
