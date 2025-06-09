import { useCallback, useReducer } from 'react';
import reducer, { init as initReducer } from './reducer';

/**
 * Provides a generic API to manage selection stats of one (default) or multiple groups of selections.
 *
 *  @param   {Array}    preselected  Array of items initially selected
 *  @param   {object}   [options]    function to call when a selection is made
 *  @param   {Function} handleSelect function to call when a selection is made
 *  @returns {object}                Object containing the current selection state and functions to manipulate it
 *
 *  @category AsyncTableTools
 *  @subcategory Hooks
 *
 */
const useSelectionManager = (preselected, options = {}, handleSelect) => {
  const { withGroups = false } = options;
  const [selection, dispatch] = useReducer(
    (state, action) => {
      const newState = reducer(state, action);

      if (handleSelect) {
        handleSelect(withGroups ? newState : newState.default);
      }

      return newState;
    },
    preselected,
    initReducer(withGroups)
  );

  const set = useCallback(
    (items, group) => dispatch({ type: 'set', group, items }),
    [dispatch]
  );

  const select = useCallback(
    (item, group, useSet = false) =>
      useSet ? set(item, group) : dispatch({ type: 'select', group, item }),
    [set, dispatch]
  );

  const deselect = useCallback(
    (item, group, useSet = false) =>
      useSet ? set(item, group) : dispatch({ type: 'deselect', group, item }),
    [dispatch, set]
  );

  const toggle = useCallback(
    (item, group) => dispatch({ type: 'toggle', group, item }),
    [dispatch]
  );

  const reset = useCallback(
    () => dispatch({ type: 'reset', preselected }),
    [dispatch, preselected]
  );

  const clear = useCallback(() => dispatch({ type: 'clear' }), [dispatch]);

  return {
    set,
    select,
    deselect,
    toggle,
    reset,
    clear,
    selection: withGroups ? selection : selection.default,
  };
};

export default useSelectionManager;
