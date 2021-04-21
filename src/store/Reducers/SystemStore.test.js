import {
    compliant,
    hasOsInfo,
    lastScanned,
    policyNames,
    mapCountOsMinorVersions,
    countOsMinorVersions,
    systemsToRows
} from './SystemStore';
import { systems } from '@/__fixtures__/systems.js';

describe('.systemsToRows', () => {
    it('should return an empty set if there are no systems', () => {
        expect(systemsToRows([])).toEqual([]);
    });

    it('should return all systems if showAllSystems is true', () => {
        expect(systemsToRows(systems).length).toEqual(systems.length);
        expect(systemsToRows(systems)).toMatchSnapshot();
    });

    it('should always return all systems for showAllSystems=true', () => {
        const systemRows = systemsToRows(systems);
        expect(systemRows.length).toBe(systems.length);

        expect(
            systemRows.map(row => row.id).sort()
        ).toEqual(systems.map(e => e.node.id).sort());

        expect(
            systemRows.map(row => row.display_name).sort()
        ).toEqual(systems.map(e => e.node.name).sort());
    });
});

describe('.lastScanned', () => {
    it('should find the latest scan date', () => {
        const system = {
            testResultProfiles: [
                { lastScanned: '2019-10-25T15:59:49Z' },
                { lastScanned: '2019-10-23T15:59:49Z' },
                { lastScanned: '2018-12-23T17:59:49Z' }
            ]
        };
        expect(lastScanned(system)).toEqual(new Date('2019-10-25T15:59:49Z'));
    });

    it('should print the latest scan date even if one profile was never scanned', () => {
        const system = {
            testResultProfiles: [
                { lastScanned: '2019-10-25T15:59:49Z' },
                { lastScanned: 'Never' }
            ]
        };
        expect(lastScanned(system)).toEqual(new Date('2019-10-25T15:59:49Z'));
    });

    it('should print Never if the scan date cannot be ascertained', () => {
        expect(lastScanned({ testResultProfiles: [] })).toEqual('Never');
        expect(lastScanned({ testResultProfiles: [{ lastScanned: 'Never' }] })).toEqual('Never');
    });
});

describe('.compliant', () => {
    it('should set false if there is one non-compliant profile', () => {
        const system = {
            testResultProfiles: [
                { compliant: true },
                { compliant: false }
            ]
        };
        expect(compliant(system)).toEqual(false);
    });

    it('should set true if all profiles are compliant', () => {
        const system = {
            testResultProfiles: [
                { compliant: true },
                { compliant: true }
            ]
        };
        expect(compliant(system)).toEqual(true);
    });
});

describe('.policyNames', () => {
    it('should return all system policies', () => {
        const system = {
            testResultProfiles: [
                { name: 'HIPAA Profile', policy: {} },
                { name: 'PCI-DSS Profile', policy: {} }
            ],
            policies: [
                { name: 'HIPAA' },
                { name: 'PCI Policy' }
            ]
        };
        expect(policyNames(system)).toEqual('HIPAA, PCI Policy');
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

describe('mapCountOsMinorVersions', () => {
    it('maps host counts by osMinorVersion', () => {
        const systems = [
            { osMinorVersion: 10 },
            { osMinorVersion: 1 },
            { osMinorVersion: 9 },
            { osMinorVersion: 9 },
            { osMinorVersion: 0 },
            {}
        ];
        expect(mapCountOsMinorVersions(systems)).toEqual({
            0: { osMinorVersion: 0, count: 1 },
            1: { osMinorVersion: 1, count: 1 },
            10: { osMinorVersion: 10, count: 1 },
            9: { osMinorVersion: 9, count: 2 }
        });
    });
});

describe('countOsMinorVersions', () => {
    it('gathers unique OS minor versions sorted', () => {
        const systems = [
            { osMinorVersion: 10 },
            { osMinorVersion: 1 },
            { osMinorVersion: 9 },
            { osMinorVersion: 9 },
            { osMinorVersion: 0 },
            {}
        ];
        expect(countOsMinorVersions(systems)).toEqual([
            { osMinorVersion: 10, count: 1 },
            { osMinorVersion: 9, count: 2 },
            { osMinorVersion: 1, count: 1 },
            { osMinorVersion: 0, count: 1 }
        ]);
    });
});
