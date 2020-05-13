import React from 'react';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { DateFormat } from '@redhat-cloud-services/frontend-components';
import { Link } from 'react-router-dom';
import { EXPORT, SELECT_ENTITY } from 'Store/ActionTypes';
import { exportFromState } from 'Utilities/Export';
import {
    ComplianceScore as complianceScore,
    complianceScoreString
} from 'PresentationalComponents';
import { Tooltip, Text } from '@patternfly/react-core';
import {
    profilesRulesPassed,
    profilesRulesFailed
} from 'Utilities/ruleHelpers';
import Truncate from 'react-truncate';

export const findProfiles = (system, profileIds) => {
    let profiles = system.profiles;

    if (profileIds !== undefined && profileIds.toString() !== '') {
        profiles = profiles.filter((profile) => profileIds.includes(profile.id));
    }

    return profiles;
};

export const lastScanned = (system, profileId) => {
    const profiles = findProfiles(system, [profileId]);
    const dates = profiles.map((profile) => new Date(profile.lastScanned));
    const last = new Date(Math.max.apply(null, dates.filter((date) => isFinite(date))));
    const result = (last instanceof Date && isFinite(last)) ? last : 'Never';

    return result;
};

export const compliant = (system, profileId) => {
    const profiles = findProfiles(system, [profileId]);
    return profiles.every(profile => profile.compliant === true);
};

export const score = (system, profileId) => {
    const profiles = findProfiles(system, [profileId]);
    const scoreTotal = profiles.reduce((acc, profile) => acc + profile.score, 0);
    const numScored = profiles.reduce((acc, profile) => {
        if (profilesRulesPassed([profile]).length + profilesRulesFailed([profile]).length > 0) { return acc + 1; }

        return acc;
    }, 0);
    if (numScored) { return scoreTotal / numScored; }

    return 0;
};

export const profileNames = (system) => {
    if (system === {}) { return ''; }

    return system.profiles.map(
        (profile) => `${profile.external ? '(External) ' : '' }${profile.name}`
    ).join(', ');
};

export const policiesCell = (system) => {
    let title;
    if (system.profileNames) {
        title = <Tooltip content={system.profileNames}>
            <Truncate lines={2} width={540}>{system.profileNames}</Truncate>
        </Tooltip>;
    } else {
        title = <Text className='grey-icon'>No policies</Text>;
    }

    return {
        title,
        exportValue: system.profileNames
    };
};

const displayNameCell = (system, matchingSystem) =>  ({
    title: <Link to={{ pathname: `/systems/${matchingSystem.id}` }}>
        { system.display_name || matchingSystem.name }
    </Link>,
    exportValue: system.display_name || matchingSystem.name
});

const isSelected = (id, selectedEntities) => (
    !!(selectedEntities || []).find((entity) => (entity.id === id))
);

export const systemsToInventoryEntities = (systems, entities, showAllSystems, profileId, selectedEntities) =>(
    entities.map(entity => {
        // This should compare the inventory ID instead with
        // the ID in compliance
        if (entity.facts === undefined) { entity.facts = {}; }

        let matchingSystem = systems.map((s) => s.node).find((system) => {
            return entity.id === system.id;
        });
        if (matchingSystem === undefined) {
            if (!showAllSystems) { return; }

            matchingSystem = { profiles: [] };
        }

        matchingSystem.profileNames = profileNames(matchingSystem);
        matchingSystem.rulesPassed = profilesRulesPassed(findProfiles(matchingSystem, [profileId])).length;
        matchingSystem.rulesFailed = profilesRulesFailed(findProfiles(matchingSystem, [profileId])).length;
        matchingSystem.lastScanned = lastScanned(matchingSystem, profileId);
        matchingSystem.compliant = compliant(matchingSystem, profileId);
        matchingSystem.score = score(matchingSystem, profileId);

        return {
            /* eslint-disable camelcase */
            id: entity.id,
            selected: isSelected(entity.id, selectedEntities),
            account: entity.account,
            bios_uuid: entity.bios_uuid,
            created: entity.created,
            display_name: entity.display_name || matchingSystem.name,
            fqdn: entity.fqdn,
            insights_id: entity.insights_id,
            ip_addresses: entity.ip_addresses,
            mac_addresses: entity.mac_addresses,
            rhel_machine_id: entity.rhel_machine_id,
            satellite_id: entity.satellite_id,
            subscription_manager_id: entity.subscription_manager_id,
            tags: entity.tags,
            updated: entity.updated,
            facts: {
                inventory: {
                    hostname: (entity.facts.inventory !== undefined) ?
                        entity.facts.inventory.hostname :
                        entity.facts.hostname,
                    machine_id: (entity.facts.inventory !== undefined) ?
                        entity.facts.inventory.machine_id :
                        entity.facts.machine_id,
                    release: (entity.facts.inventory !== undefined) ?
                        entity.facts.inventory.release :
                        entity.facts.release
                },
                compliance: {
                    display_name: displayNameCell(systems, matchingSystem),
                    policies: policiesCell(matchingSystem),
                    details_link: matchingSystem.profileNames && {
                        title: <Link to={{ pathname: `/systems/${matchingSystem.id}` }}>
                            View report
                        </Link>
                    },
                    rules_passed: matchingSystem.rulesPassed,
                    rules_failed: { title: <Link to={{
                        pathname: `/systems/${matchingSystem.id}`,
                        query: {
                            hidePassed: true
                        }
                    }}>{matchingSystem.rulesFailed}</Link> },
                    rules_failed_text: matchingSystem.rulesFailed,
                    compliance_score: complianceScore(matchingSystem),
                    compliance_score_text: complianceScoreString(matchingSystem),
                    last_scanned: (matchingSystem.lastScanned instanceof Date) ?
                        { title: <DateFormat date={Date.parse(matchingSystem.lastScanned)} type='relative' /> } :
                        matchingSystem.lastScanned,
                    last_scanned_text: matchingSystem.lastScanned
                }
            }
            /* eslint-enable camelcase */
        };
    }).filter(value => value !== undefined)
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
    selectedEntities: state.selectedEntities.filter((row) => !ids.includes(row.id))
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

export const entitiesReducer = (INVENTORY_ACTION, columns, showAllSystems, profileId) => applyReducerHash(
    {
        ['UPDATE_SYSTEMS']: (state, { systems, systemsCount }) => ({
            ...state,
            systems,
            systemsCount
        }),
        ['UPDATE_ROWS']: (state) => ({
            ...state,
            loaded: true,
            rows: systemsToInventoryEntities(
                state.systems || [],
                state.rows || [],
                showAllSystems,
                profileId,
                state.selectedEntities
            )
        }),
        [INVENTORY_ACTION.LOAD_ENTITIES_FULFILLED]: (state) => ({
            ...state,
            rows: systemsToInventoryEntities(
                state.systems || [],
                state.rows,
                showAllSystems,
                profileId,
                state.selectedEntities
            ),
            total: !showAllSystems ? state.systemsCount : state.total,
            columns
        }),
        [EXPORT]: (state, { payload: { format } }) => {
            exportFromState(state, format);
            return state;
        },
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
        }
    }
);
