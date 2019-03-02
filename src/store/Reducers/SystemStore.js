import React from 'react';
import { applyReducerHash } from '@red-hat-insights/insights-frontend-components/Utilities/ReducerRegistry';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

export const systemsToInventoryEntities = (systems, entities) =>
    systems.map(
        system => {
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
                        profiles: system.profile_names,
                        rules_passed: system.rules_passed,
                        rules_failed: <Link to={{
                            pathname: `/systems/${system.id}`,
                            query: {
                                hidePassed: true
                            }
                        }}>{system.rules_failed}</Link>,
                        score: (100 * (system.rules_passed / (system.rules_passed + system.rules_failed))).toFixed(2) + '%',
                        last_scanned: system.last_scanned,
                        compliant: (system.compliant ? <CheckCircleIcon style={{ color: '#92d400' }}/> :
                            <ExclamationCircleIcon style={{ color: '#a30000' }}/>)
                    }
                }
                /* eslint-enable camelcase */
            };
        }
    ).filter(value => value !== undefined);

export const entitiesReducer = (INVENTORY_ACTION, systems, columns) => applyReducerHash(
    {
        [INVENTORY_ACTION.LOAD_ENTITIES_FULFILLED]: (state) => {
            state.rows = systemsToInventoryEntities(systems, state.rows);
            state.count = state.rows.length;
            state.total = state.rows.length;
            state.columns = [];
            for (const column of columns) {
                state.columns.push(column);
            }

            return { ...state };
        }
    }
);
