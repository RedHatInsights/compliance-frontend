import Immutable from 'seamless-immutable';
import * as ActionTypes from '../ActionTypes';
import { applyReducerHash } from '@red-hat-insights/insights-frontend-components/Utilities/ReducerRegistry';

// eslint-disable-next-line new-cap
const initialState = Immutable({
    systemsList: {
        isLoading: true,
        items: []
    }
});

export const systemsToInventoryEntities = (systems, entities) =>
//export const systemsToInventoryEntities = (systems) =>
    // eslint-disable-next-line no-console
    // console.log('My entities', entities);
    //    matching_entity = entities.find((entity) => {
    //    entity.facts.inventory.hostname === system.attributes.name
    // });
    systems.map(
        system => {
            let matchingEntity = entities.find((entity) => {
                return entity.facts.inventory !== undefined &&
                    entity.facts.inventory.hostname === system.name;
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
                        hostname: matchingEntity.facts.inventory.hostname,
                        machine_id: matchingEntity.facts.inventory.machine_id,
                        release: matchingEntity.facts.inventory.release
                    },
                    compliance: {
                        profiles: system.profile_names,
                        rules_passed: system.rules_passed,
                        rules_failed: system.rules_failed,
                        score: (100 * (system.rules_failed / system.rules_passed)).toFixed(2) + '%',
                        last_scanned: system.last_scanned,
                        compliant: system.compliant.toString()
                    }
                }
                /* eslint-enable camelcase */
            };
        }
    ).filter(value => value !== undefined);

export const entitiesDetailReducer = (INVENTORY_ACTION, systems, columns) => applyReducerHash(
    {
        [INVENTORY_ACTION.LOAD_ENTITIES_FULFILLED]: (state) => {
            state.entities = systemsToInventoryEntities(systems, state.entities);
            state.columns.push(...columns);
            return { ...state };
        }
    },
    initialState
);

export const SystemReducer = (state = initialState, action) => {
    let newState;

    switch (action.type) {
        case ActionTypes.FETCH_COMPLIANCE_SYSTEMS + '_PENDING':
            return Immutable.setIn(state, ['systemsList', 'isLoading'], true);

        case ActionTypes.FETCH_COMPLIANCE_SYSTEMS + '_FULFILLED':
            newState = Immutable.setIn(state, ['systemsList', 'items'], action.payload.data);
            newState = Immutable.setIn(newState, ['systemsList', 'isLoading'], false);
            return newState;

        default:
            return state;
    }
};
