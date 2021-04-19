import React from 'react';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { Link } from 'react-router-dom';
import { SELECT_ENTITY } from 'Store/ActionTypes';
import {
    Tooltip,
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core';
import {
    profilesRulesPassed,
    profilesRulesFailed
} from 'Utilities/ruleHelpers';
import Truncate from 'react-truncate';
import { sortingByProp } from 'Utilities/helpers';

const NEVER = 'Never';

export const lastScanned = ({ testResultProfiles: profiles = [] }) => {
    const dates = profiles.map((profile) => new Date(profile.lastScanned));
    const last = new Date(Math.max.apply(null, dates.filter((date) => isFinite(date))));
    const result = (last instanceof Date && isFinite(last)) ? last : NEVER;

    return result;
};

export const compliant = ({ testResultProfiles: profiles = [] }) => (
    profiles.every(profile => profile.lastScanned === NEVER || profile.compliant === true)
);

export const score = ({ testResultProfiles: profiles = [] }) => {
    const scoreTotal = profiles.reduce((acc, profile) => acc + profile.score, 0);
    const numScored = profiles.reduce((acc, profile) => {
        if (profilesRulesPassed([profile]).length + profilesRulesFailed([profile]).length > 0) { return acc + 1; }

        return acc;
    }, 0);
    if (numScored) { return scoreTotal / numScored; }

    return 0;
};

export const supported = ({ testResultProfiles: profiles = [] }) => (
    profiles.reduce((acc, profile) => acc && profile.supported, true)
);

export const policyNames = (system) => {
    if (system === {}) { return ''; }

    let policyNames = system.policies.map(({ name }) => name);
    return policyNames.join(', ');
};

export const policiesCell = ({ policyNames }) => ({
    title: policyNames ? (
        <Tooltip content={policyNames}>
            <Truncate lines={2} width={540}>{policyNames}</Truncate>
        </Tooltip>
    ) : <Text className='grey-icon'>No policies</Text>,
    exportValue: policyNames
});

export const detailsLink = (system) => {
    if (system.testResultProfiles && system.testResultProfiles.length > 0) {
        return {
            title: (
                <Link to={{ pathname: `/systems/${system.id}` }}>
                    View report
                </Link>
            )
        };
    }
};

export const hasOsInfo = (matchingSystem) => (
    typeof(matchingSystem.osMajorVersion) !== 'undefined' && typeof(matchingSystem.osMinorVersion) !== 'undefined' &&
        matchingSystem.osMajorVersion !== null && matchingSystem.osMinorVersion !== null &&
        !(matchingSystem.osMajorVersion === 0 && matchingSystem.osMinorVersion === 0)
);

export const systemName = (displayName, id, { osMajorVersion, osMinorVersion, name }) => (
    <TextContent>
        <Link to={{ pathname: `/systems/${id}` }}>
            { displayName || name }
        </Link>
        { hasOsInfo({ osMajorVersion, osMinorVersion }) &&
            <Text component={TextVariants.small}>RHEL {osMajorVersion}.{osMinorVersion}</Text> }
    </TextContent>
);

const isSelected = (id, selectedEntities) => (
    !!(selectedEntities || []).find((entity) => (entity.id === id))
);

const profilesSsgVersions = ({ testResultProfiles: profiles = [] }) => (
    profiles.map((p) => (p.ssgVersion)).filter((version) => (!!version)).join(', ')
);

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

const systemsToRows = (systems, selectedEntities) => (
    (systems || []).map(({ node }) => ({
        ...node,
        policyNames: policyNames({ policies: node?.policies, testResultProfiles: [] }),
        rulesPassed: profilesRulesPassed(node.testResultProfiles).length,
        rulesFailed: profilesRulesFailed(node.testResultProfiles).length,
        lastScanned: lastScanned(node),
        compliant: compliant(node),
        display_name: node.name, // eslint-disable-line camelcase
        score: score(node),
        supported: supported(node),
        ssgVersion: profilesSsgVersions(node),
        detailsLink: detailsLink(node),
        selected: selectedEntities && isSelected(node.id, selectedEntities)
    }))
);

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

export const systemsReducer = (INVENTORY_ACTION, columns) => applyReducerHash({
    ['GET_SYSTEMS_PENDING']: (state) => ({
        ...state,
        rows: [],
        systems: undefined,
        systemsCount: undefined,
        columns,
        loaded: false
    }),
    ['GET_SYSTEMS_FULFILLED']: (state, { systems, systemsCount }) => ({
        ...state,
        systems,
        systemsCount,
        total: systemsCount,
        rows: systemsToRows(systems, state.selectedEntities),
        columns,
        loaded: true
    }),
    [INVENTORY_ACTION.LOAD_ENTITIES_PENDING]: (state) => ({
        ...state,
        total: state.systemsCount,
        rows: systemsToRows(state.systems, state.selectedEntities),
        columns,
        loaded: state.systemsCount !== undefined
    }),
    [INVENTORY_ACTION.LOAD_ENTITIES_FULFILLED]: (state) => ({
        ...state,
        total: state.systemsCount,
        rows: systemsToRows(state.systems, state.selectedEntities),
        columns,
        loaded: state.systemsCount !== undefined
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
    ['SELECT_ENTITIES']: (state, { payload: { ids } }) => ({
        selectedEntities: ids
    })
});
