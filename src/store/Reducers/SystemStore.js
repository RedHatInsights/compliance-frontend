import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { sortingByProp } from 'Utilities/helpers';
import * as ActionTypes from '../Types';

const selectRows = (rows, selected) =>
  (rows ?? []).map((row) => ({
    ...row,
    selected: selected.includes(row.id),
  }));

export const entitiesReducer = () =>
  applyReducerHash({
    ['INVENTORY_INIT']: () => ({
      rows: [],
      total: 0,
    }),
    ['RESET_PAGE']: (state) => ({
      ...state,
      page: 1,
    }),
    ['SELECT_ENTITIES']: (state, { payload: { selected } }) => ({
      ...state,
      rows: selectRows(state.rows, selected),
    }),
    [ActionTypes.SET_DISABLED_SYSTEM_SELECTION]: (state, action) => ({
      ...state,
      ...(state?.rows
        ? {
            rows: state.rows.map((row) => ({
              ...row,
              disableSelection: action.payload,
            })),
          }
        : {}),
    }),
  });

export const mapCountOsMinorVersions = (systems, profile) => {
  if (!systems || systems.length === 0) {
    return profile.os_minor_versions.reduce((acc, version) => {
      acc[version] = {
        osMinorVersion: version,
        count: 0,
      };
      return acc;
    }, {});
  }

  return systems.reduce((acc, { os_minor_version }) => {
    if (os_minor_version !== undefined && os_minor_version !== null) {
      (acc[os_minor_version] = acc[os_minor_version] || {
        osMinorVersion: os_minor_version,
        count: 0,
      }).count++;
    }

    return acc;
  }, {});
};

export const countOsMinorVersions = (systems, profile) =>
  Object.values(mapCountOsMinorVersions(systems, profile)).sort(
    sortingByProp('osMinorVersion', 'desc'),
  );
