import React from 'react';
import { QuestionCircleIcon, CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import {
    compliantIcon,
    rulesCount,
    lastScanned,
    systemsToInventoryEntities
} from './SystemStore';
import { systems, entities } from './SystemStore.fixtures';

describe('mapping systems to inventory entities', () => {
    it('should return an empty set if there are no systems', () => {
        expect(systemsToInventoryEntities([], entities)).toEqual([]);
    });

    it('should only return systems with a matching inventory entity', () => {
        const oneMatchingEntityInventory = [{ id: 'd5bc2459-21ce-4d11-bc0b-03ea7513dfa6', facts: [] }];
        const inventoryEntities = systemsToInventoryEntities(systems, oneMatchingEntityInventory);
        expect(inventoryEntities.length).toBe(1);
    });

    it('should only return all systems if all have a matching in the inventory', () => {
        const inventoryEntities = systemsToInventoryEntities(systems, entities);
        const systemIds = systems.map(system => system.node.id);
        const systemNames = systems.map(system => system.node.name);
        const systemComplianceScores = [' 40%', ' N/A'];
        expect(inventoryEntities.length).toBe(2);
        expect(inventoryEntities.map(entity => entity.id).sort()).toEqual(systemIds.sort());
        expect(inventoryEntities.map(entity => entity.display_name).sort()).toEqual(systemNames.sort());
        expect(inventoryEntities.map(entity => entity.facts.compliance.compliance_score_text).sort()).
        toEqual(systemComplianceScores.sort());
    });
});

describe('auxiliary functions to reducer', () => {
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

    it('should show a danger icon if the host is not compliant in any profile', () => {
        const system = {
            rulesPassed: 30,
            rulesFailed: 300,
            profiles: [
                { compliant: false },
                { compliant: false }
            ]
        };

        expect(compliantIcon(system)).toEqual(
            <React.Fragment>
                <ExclamationCircleIcon color='currentColor' noVerticalAlign={false} size='sm'
                    style={ { color: 'var(--pf-global--danger-color--100)' } }
                    title={null} />
            </React.Fragment>
        );
    });

    it('should show a danger icon if the host is not compliant in some profile', () => {
        const system = {
            rulesPassed: 30,
            rulesFailed: 3,
            profiles: [
                { compliant: true },
                { compliant: false }
            ]
        };

        expect(compliantIcon(system)).toEqual(
            <React.Fragment>
                <ExclamationCircleIcon color='currentColor' noVerticalAlign={false} size='sm'
                    style={ { color: 'var(--pf-global--danger-color--100)' } }
                    title={null} />
            </React.Fragment>
        );
    });

    it('should show a success icon if the host is compliant in all profiles', () => {
        const system = {
            rulesPassed: 30,
            rulesFailed: 3,
            profiles: [
                { compliant: true },
                { compliant: true }
            ]
        };

        expect(compliantIcon(system)).toEqual(
            <React.Fragment>
                <CheckCircleIcon color='currentColor' noVerticalAlign={false} size="sm"
                    style={ { color: 'var(--pf-global--success-color--100)' } }
                    title={null} />
            </React.Fragment>
        );
    });

    it('should show a question mark icon if the host has no rules passed or failed', () => {
        const system = {
            rulesPassed: 0,
            rulesFailed: 0
        };

        expect(compliantIcon(system)).toEqual(
            <React.Fragment>
                <QuestionCircleIcon color='currentColor' noVerticalAlign={false} size="sm"
                    style={ { color: 'var(--pf-global--disabled-color--100)' } }
                    title={null} />
            </React.Fragment>
        );
    });
});
