import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { sortingByProp } from 'Utilities/helpers';

const selectRows = (rows, selected) => (
    rows.map((row) => ({
        ...row,
        selected: selected.map((entity) => (entity.id)).includes(row.id)
    }))
);

export const entitiesReducer = (INVENTORY_ACTION) => applyReducerHash({
    ['INVENTORY_INIT']: () => ({
        rows: [],
        total: 0
    }),
    [INVENTORY_ACTION.LOAD_ENTITIES_FULFILLED]: (state) => ({
        ...state,
        rows: state?.selectedEntities ? selectRows(state.rows, state.selectedEntities) : state.rows
    }),
    ['RESET_PAGE']: (state) => ({
        ...state,
        page: 1
    }),
    ['SELECT_ENTITIES']: (state, { payload: { selected } }) => ({
        ...state,
        selectedEntities: selected,
        rows: selectRows(state.rows, selected)
    })
});

export const mapCountOsMinorVersions = (systems) => {
    if (!systems) { return {}; }

    return systems.reduce((acc, { osMinorVersion }) => {
        if (osMinorVersion !== undefined && osMinorVersion !== null) {
            (acc[osMinorVersion] = acc[osMinorVersion] || { osMinorVersion, count: 0 }).count++;
        }

        return acc;
    }, {});
};

export const countOsMinorVersions = (systems) => (
    Object.values(mapCountOsMinorVersions(systems)).sort(sortingByProp('osMinorVersion', 'desc'))
);
