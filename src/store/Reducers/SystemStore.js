import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { EXPORT, SELECT_ENTITY } from 'Store/ActionTypes';
import { exportFromState } from 'Utilities/Export';

const selectRowsByIds = (state, ids) => {
    const rowsToSelect = state.rows.filter((row) => (
        ids.includes(row.id) && !(state.selectedEntities || []).map((e) => (e.id)).includes(row.id)
    ));

    return {
        ...state,
        selectedEntities: (state.selectedEntities || []).concat(rowsToSelect)
    };
};

const deselectRowsByIds = (state, ids) => ({
    ...state,
    selectedEntities: (state.selectedEntities || []).filter((row) => !ids.includes(row.id))
});

const selectAllRows = (state) => (
    selectRowsByIds(state, state.rows.map((row) => (row.id)))
);

const deselectAllRows = (state) => (
    deselectRowsByIds(state, state.rows.map((row) => (row.id)))
);

const selectRow = (state, id) => (
    selectRowsByIds(state, [id])
);

const deselectRow = (state, id) => (
    deselectRowsByIds(state, [id])
);

export const entitiesReducer = (INVENTORY_ACTION, columns) => applyReducerHash({
    [INVENTORY_ACTION.LOAD_ENTITIES_FULFILLED]: (state) => ({
        ...state,
        columns: state.total > 0 ? columns : [{ title: '' }]
    }),
    [SELECT_ENTITY]: (state, { payload: { id, selected, clearAll } }) => {
        let newState;

        if (id === 0) {
            newState = selected ? selectAllRows(state) : deselectAllRows(state);
        } else {
            newState = selected ? selectRow(state, id) : deselectRow(state, id);
        }

        if (newState.selectedEntities.length === 0 || clearAll) {
            newState.selectedEntities = undefined;
        }

        return newState;
    },
    [EXPORT]: (state, { payload: { format } }) => {
        exportFromState(state, format);
        return state;
    },
    ['SELECT_ENTITIES']: (state, { payload: { ids } }) => ({
        selectedEntities: ids
    })
});
