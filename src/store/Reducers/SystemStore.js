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
                return entity.facts.inventory.hostname === system.attributes.name;
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
                        profiles: system.attributes.profiles.map((profile) => profile.name).join(),
                        rules_passed: '100',
                        rules_failed: '50',
                        score: '75%',
                        last_scanned: '4 days ago',
                        compliant: 'true'
                    }
                }
                /* eslint-enable camelcase */
            };
        }
    ).filter(value => value !== undefined);

export const entitiesDetailReducer = (INVENTORY_ACTION, systems) => applyReducerHash(
    {
        //[INVENTORY_ACTION.LOAD_ENTITY_FULFILLED]: (state, action) => {
        [INVENTORY_ACTION.LOAD_ENTITIES_FULFILLED]: (state, action) => {
            /* eslint-disable no-console */
            // action contains the new items
            // state.systemsList.items
            // Merge state.entities.entities with action.items (which contains my items)
            // Change the columns from state.entities.columns
            //
            //
            // concatenate the names of profiles
            //let hosts = [
            //    {
            //        id: '19200f9f-dd49-4ec9-ac91-83009ec0acec',
            //        facts: {
            //            compliance: {
            //                profiles: 'profile 1, profile 2', compliant: 'true'
            //            }
            //        }
            //    }
            //];
            console.log('My items', action);
            console.log('My systems', systems);
            state.entities = systemsToInventoryEntities(systems, state.entities);
            console.log('My new entities', state.entities);
            state.columns.push({
                key: 'facts.compliance.profiles',
                title: 'Profile'
            }, {
                key: 'facts.compliance.rules_passed',
                title: 'Rules Passed'
            }, {
                key: 'facts.compliance.rules_failed',
                title: 'Rules Failed'
            }, {
                key: 'facts.compliance.score',
                title: 'Score'
            }, {
                key: 'facts.compliance.compliant',
                title: 'Compliant'
            }, {
                key: 'facts.compliance.last_scanned',
                title: 'Last Scanned'
            });
            /* eslint-enable no-console */
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
