import {
    rulesCount,
    lastScanned,
    compliant,
    findProfiles,
    systemsToInventoryEntities
} from './SystemStore';
import { systems, entities } from './SystemStore.fixtures';

describe('mapping systems to inventory entities', () => {
    it('should return an empty set if there are no systems', () => {
        expect(systemsToInventoryEntities([], entities, false)).toEqual([]);
    });

    it('should return all systems if showAllSystems is true', () => {
        expect(systemsToInventoryEntities([], entities, true).length).toEqual(entities.length);
    });

    it('should only return systems with a matching inventory entity', () => {
        const oneMatchingEntityInventory = [{ id: 'd5bc2459-21ce-4d11-bc0b-03ea7513dfa6', facts: [] }];
        const inventoryEntities = systemsToInventoryEntities(systems, oneMatchingEntityInventory);
        expect(inventoryEntities.length).toBe(1);
        expect(inventoryEntities).toMatchSnapshot();
    });

    it('should only return all systems if all have a matching in the inventory for showAllSystems=false', () => {
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

    it('should always return all systems for showAllSystems=true', () => {
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

    it('should set rules count for a specific profile', () => {
        const system = {
            profiles: [
                { id: '1', rulesPassed: 3, rulesFailed: 1 },
                { id: '2', rulesPassed: 10, rulesFailed: 3 }
            ]
        };
        expect(rulesCount(system, 'rulesPassed', '1')).toEqual(3);
        expect(rulesCount(system, 'rulesFailed', '1')).toEqual(1);
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

    it('should find the latest scan date for a specific profile', () => {
        const system = {
            profiles: [
                { id: '1', lastScanned: '2019-10-23T15:59:49Z' },
                { id: '2', lastScanned: '2018-12-23T17:59:49Z' }
            ]
        };
        expect(lastScanned(system, '1')).toEqual(new Date('2019-10-23T15:59:49Z'));
        expect(lastScanned(system, '2')).toEqual(new Date('2018-12-23T17:59:49Z'));
    });
});

describe('.compliant', () => {
    it('should set false if there is one non-compliant profile', () => {
        const system = {
            profiles: [
                { compliant: true },
                { compliant: false }
            ]
        };
        expect(compliant(system)).toEqual(false);
    });

    it('should set true if all profiles are compliant', () => {
        const system = {
            profiles: [
                { compliant: true },
                { compliant: true }
            ]
        };
        expect(compliant(system)).toEqual(true);
    });

    it('should return value for a specific profile', () => {
        const system = {
            profiles: [
                { id: '1', compliant: true },
                { id: '2', compliant: false }
            ]
        };
        expect(compliant(system, '1')).toEqual(true);
        expect(compliant(system, '2')).toEqual(false);
    });
});

describe('.findProfiles', () => {
    it('should return all profiles if empty profileIds is sent', () => {
        const system = {
            profiles: [
                { compliant: true },
                { compliant: false }
            ]
        };
        expect(findProfiles(system, [''])).toEqual(system.profiles);
    });

    it('should return a specific profile if profile Id is sent', () => {
        const system = {
            profiles: [
                { id: '1', compliant: true },
                { id: '2', compliant: true }
            ]
        };
        expect(findProfiles(system, ['1'])).toEqual([system.profiles[0]]);
        expect(findProfiles(system, ['1', '2'])).toEqual(system.profiles);
    });
});

