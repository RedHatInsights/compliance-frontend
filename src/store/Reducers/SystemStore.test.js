import {
    rulesCount,
    lastScanned,
    systemsToInventoryEntities
} from './SystemStore';
import { systems, entities } from './SystemStore.fixtures';

describe('mapping systems to inventory entities', () => {
    it('should return an empty set if there are no systems', () => {
        expect(systemsToInventoryEntities([], entities, false)).toEqual([]);
    });

    it('should return all systems if allSystems is true', () => {
        expect(systemsToInventoryEntities([], entities, true).length).toEqual(entities.length);
    });

    it('should only return systems with a matching inventory entity', () => {
        const oneMatchingEntityInventory = [{ id: 'd5bc2459-21ce-4d11-bc0b-03ea7513dfa6', facts: [] }];
        const inventoryEntities = systemsToInventoryEntities(systems, oneMatchingEntityInventory);
        expect(inventoryEntities.length).toBe(1);
        expect(inventoryEntities).toMatchSnapshot();
    });

    it('should only return all systems if all have a matching in the inventory for allSystems=false', () => {
        const inventoryEntities = systemsToInventoryEntities(systems, entities, false);
        const systemIds = systems.map(system => system.node.id);
        const systemNames = systems.map(system => system.node.name);
        const systemComplianceScores = [' 40%', ' N/A'];
        expect(inventoryEntities.length).toBe(2);
        expect(inventoryEntities.map(entity => entity.id).sort()).toEqual(systemIds.sort());
        expect(inventoryEntities.map(entity => entity.display_name).sort()).toEqual(systemNames.sort());
        expect(inventoryEntities.map(entity => entity.facts.compliance.compliance_score_text).sort()).
        toEqual(systemComplianceScores.sort());
    });

    it('should always return all systems for allSystems=true', () => {
        const inventoryEntities = systemsToInventoryEntities(systems, entities, true);
        const systemComplianceScores = [' 40%', ' N/A', ' N/A', ' N/A'];
        expect(inventoryEntities.length).toBe(entities.length);
        expect(inventoryEntities.map(entity => entity.id).sort()).toEqual(entities.map(e => e.id).sort());
        expect(inventoryEntities.map(entity => entity.display_name).sort()).toEqual(entities.map(e => e.display_name).sort());
        expect(inventoryEntities.map(entity => entity.facts.compliance.compliance_score_text).sort()).
        toEqual(systemComplianceScores.sort());
    });
});

describe('.rulesCount', () => {
    it('should set rules count as the sum over all profiles', () => {
        const system = {
            profiles: [
                { rulesPassed: 3, rulesFailed: 1 },
                { rulesPassed: 10, rulesFailed: 3 }
            ]
        };
        expect(rulesCount(system, 'rulesPassed')).toEqual(13);
        expect(rulesCount(system, 'rulesFailed')).toEqual(4);
    });

    it('should set rules count even if profiles is an empty array', () => {
        const system = { profiles: [] };
        expect(rulesCount(system, 'rulesPassed')).toEqual(0);
        expect(rulesCount(system, 'rulesFailed')).toEqual(0);
    });
});

describe('.lastScanned', () => {
    it('should find the latest scan date', () => {
        const system = {
            profiles: [
                { lastScanned: '2019-10-25T15:59:49Z' },
                { lastScanned: '2019-10-23T15:59:49Z' },
                { lastScanned: '2018-12-23T17:59:49Z' }
            ]
        };
        expect(lastScanned(system)).toEqual(new Date('2019-10-25T15:59:49Z'));
    });

    it('should print the latest scan date even if one profile was never scanned', () => {
        const system = {
            profiles: [
                { lastScanned: '2019-10-25T15:59:49Z' },
                { lastScanned: 'Never' }
            ]
        };
        expect(lastScanned(system)).toEqual(new Date('2019-10-25T15:59:49Z'));
    });

    it('should print Never if the scan date cannot be ascertained', () => {
        expect(lastScanned({ profiles: [] })).toEqual('Never');
        expect(lastScanned({ profiles: [{ lastScanned: 'Never' }] })).toEqual('Never');
    });
});
