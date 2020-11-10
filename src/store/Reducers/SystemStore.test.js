import {
    compliant,
    hasOsInfo,
    lastScanned,
    profileNames,
    systemsToInventoryEntities
} from './SystemStore';
import { systems, entities } from '@/__fixtures__/systems.js';

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
        const systemComplianceScores = [' 10%', ' N/A'];
        expect(inventoryEntities.length).toBe(2);
        expect(inventoryEntities.map(entity => entity.id).sort()).toEqual(systemIds.sort());
        expect(inventoryEntities.map(entity => entity.display_name).sort()).toEqual(systemNames.sort());
        expect(inventoryEntities.map(entity => entity.facts.compliance.compliance_score_text).sort()).
        toEqual(systemComplianceScores.sort());
    });

    it('should always return all systems for showAllSystems=true', () => {
        const inventoryEntities = systemsToInventoryEntities(systems, entities, true);
        const systemComplianceScores = [' 10%', ' N/A', ' N/A', ' N/A'];
        expect(inventoryEntities.length).toBe(entities.length);
        expect(inventoryEntities.map(entity => entity.id).sort()).toEqual(entities.map(e => e.id).sort());
        expect(inventoryEntities.map(entity => entity.display_name).sort()).toEqual(entities.map(e => e.display_name).sort());
        expect(inventoryEntities.map(entity => entity.facts.compliance.compliance_score_text).sort()).
        toEqual(systemComplianceScores.sort());
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
});

describe('.profileNames', () => {
    it('should include external if profile is external', () => {
        const system = {
            profiles: [
                { name: 'HIPAA' },
                { policy: {}, name: 'PCI' }
            ]
        };
        expect(profileNames(system)).toEqual('(External) HIPAA, PCI');
    });
});

describe('hasOsInfo', () => {
    it('return true for 7.3', () => {
        const result = hasOsInfo({
            osMajorVersion: 7,
            osMinorVersion: 3
        });
        expect(result).toEqual(true);
    });

    it('return true for 8.0', () => {
        const result = hasOsInfo({
            osMajorVersion: 8,
            osMinorVersion: 0
        });
        expect(result).toEqual(true);
    });

    it('return false for both versions being 0', () => {
        const result = hasOsInfo({
            osMajorVersion: 0,
            osMinorVersion: 0
        });
        expect(result).toEqual(false);
    });

    it('return false for version being null', () => {
        const result = hasOsInfo({
            osMajorVersion: null,
            osMinorVersion: null
        });
        expect(result).toEqual(false);
    });
});
