import React from 'react';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { DateFormat } from '@redhat-cloud-services/frontend-components';
import { Link } from 'react-router-dom';
import { EXPORT_TO_CSV } from '../ActionTypes';
import { downloadCsv } from 'Utilities/Export';
import {
    ComplianceScore as complianceScore,
    complianceScoreString
} from 'PresentationalComponents';

const findProfiles = (system, defaultReturn, profileId) => {
    if (system.profiles === undefined) { return defaultReturn; }

    let profiles = system.profiles;

    if (profileId !== undefined && profileId !== '') {
        profiles = profiles.filter((profile) => profile.id === profileId);
    }

    return profiles;
};

export const lastScanned = (system, profileId) => {
    const profiles = findProfiles(system, 'Never', profileId);
    const dates = profiles.map((profile) => new Date(profile.lastScanned));
    const last = new Date(Math.max.apply(null, dates.filter((date) => isFinite(date))));
    const result = (last instanceof Date && isFinite(last)) ? last : 'Never';

    return result;
};

export const rulesCount = (system, rulesMethod, profileId) => {
    const profiles = findProfiles(system, 0, profileId);
    const rulesCount = profiles.map((profile) => profile[rulesMethod]);
    return (rulesCount.length > 0 && rulesCount.reduce((acc, curr) => acc + curr)) || 0;
};

export const compliant = (system, profileId) => {
    const profiles = findProfiles(system, false, profileId);
    return profiles.every(profile => profile.compliant === true);
};

export const systemsToInventoryEntities = (systems, entities, showAllSystems, profileId) =>
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

        matchingSystem.profileNames = matchingSystem === {} ? '' :
            matchingSystem.profiles.map((profile) => profile.name).join(', ');
        matchingSystem.rulesPassed = rulesCount(matchingSystem, 'rulesPassed', profileId);
        matchingSystem.rulesFailed = rulesCount(matchingSystem, 'rulesFailed', profileId);
        matchingSystem.lastScanned = lastScanned(matchingSystem, profileId);
        matchingSystem.compliant = compliant(matchingSystem, profileId);

        return {
            /* eslint-disable camelcase */
            id: entity.id,
            account: entity.account,
            bios_uuid: entity.bios_uuid,
            created: entity.created,
            display_name: entity.display_name,
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
                    profiles: matchingSystem.profileNames,
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
    }).filter(value => value !== undefined);

export const entitiesReducer = (INVENTORY_ACTION, systems, columns, isGraphqlFinished, showAllSystems,
    profileId) => applyReducerHash(
    {
        [INVENTORY_ACTION.LOAD_ENTITIES_FULFILLED]: (state) => {
            if (!isGraphqlFinished()) {
                return { ...state, loaded: false };
            }

            state.rows = systemsToInventoryEntities(systems(), state.rows, showAllSystems, profileId);
            state.count = state.rows.length;
            state.total = state.rows.length;
            state.columns = [];
            for (const column of columns) {
                state.columns.push(column);
            }

            return { ...state };
        },
        [EXPORT_TO_CSV]: (state) => {
            downloadCsv(state);
            return state;
        }
    }
);
