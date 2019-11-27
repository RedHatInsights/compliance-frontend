import React from 'react';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { Link } from 'react-router-dom';
import { FormattedRelative } from 'react-intl';
import { EXPORT_TO_CSV } from '../ActionTypes';
import { downloadCsv } from '../../Utilities/CsvExport';
import {
    ComplianceScore as complianceScore,
    complianceScoreString
} from '../../PresentationalComponents';

export const lastScanned = (system) => {
    const dates = system.profiles.map((profile) => new Date(profile.lastScanned));
    const last = new Date(Math.max.apply(null, dates.filter((date) => isFinite(date))));
    const result = (last instanceof Date && isFinite(last)) ? last : 'Never';

    return result;
};

export const rulesCount = (system, rulesMethod) => {
    const rulesCount = system.profiles.map((profile) => profile[rulesMethod]);
    return (rulesCount.length > 0 && rulesCount.reduce((acc, curr) => acc + curr)) || 0;
};

export const systemsToInventoryEntities = (systems, entities) =>
    systems.map(
        edge => {
            const system = edge.node;
            system.profileNames = system.profiles.map((profile) => profile.name).join(', ');
            system.rulesPassed = rulesCount(system, 'rulesPassed');
            system.rulesFailed = rulesCount(system, 'rulesFailed');
            system.lastScanned = lastScanned(system);
            // This should compare the inventory ID instead with
            // the ID in compliance
            let matchingEntity = entities.find((entity) => {
                return entity.facts !== undefined &&
                    entity.id === system.id;
            });
            if (matchingEntity === undefined) {
                return;
            }

            return {
                /* eslint-disable camelcase */
                id: system.id,
                account: matchingEntity.account,
                bios_uuid: matchingEntity.bios_uuid,
                created: matchingEntity.created,
                display_name: matchingEntity.display_name,
                fqdn: matchingEntity.fqdn,
                insights_id: matchingEntity.insights_id,
                ip_addresses: matchingEntity.ip_addresses,
                mac_addresses: matchingEntity.mac_addresses,
                rhel_machine_id: matchingEntity.rhel_machine_id,
                satellite_id: matchingEntity.satellite_id,
                subscription_manager_id: matchingEntity.subscription_manager_id,
                tags: matchingEntity.tags,
                updated: matchingEntity.updated,
                facts: {
                    inventory: {
                        hostname: (matchingEntity.facts.inventory !== undefined) ?
                            matchingEntity.facts.inventory.hostname :
                            matchingEntity.facts.hostname,
                        machine_id: (matchingEntity.facts.inventory !== undefined) ?
                            matchingEntity.facts.inventory.machine_id :
                            matchingEntity.facts.machine_id,
                        release: (matchingEntity.facts.inventory !== undefined) ?
                            matchingEntity.facts.inventory.release :
                            matchingEntity.facts.release
                    },
                    compliance: {
                        profiles: system.profileNames,
                        rules_passed: system.rulesPassed,
                        rules_failed: { title: <Link to={{
                            pathname: `/systems/${system.id}`,
                            query: {
                                hidePassed: true
                            }
                        }}>{system.rulesFailed}</Link> },
                        rules_failed_text: system.rulesFailed,
                        compliance_score: complianceScore(system),
                        compliance_score_text: complianceScoreString(system),
                        last_scanned: (system.lastScanned instanceof Date) ?
                            { title: <FormattedRelative value={Date.parse(system.lastScanned)} /> } :
                            system.lastScanned,
                        last_scanned_text: system.lastScanned
                    }
                }
                /* eslint-enable camelcase */
            };
        }
    ).filter(value => value !== undefined);

export const entitiesReducer = (INVENTORY_ACTION, systems, columns) => applyReducerHash(
    {
        [INVENTORY_ACTION.LOAD_ENTITIES_FULFILLED]: (state) => {
            state.rows = systemsToInventoryEntities(systems(), state.rows);
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
